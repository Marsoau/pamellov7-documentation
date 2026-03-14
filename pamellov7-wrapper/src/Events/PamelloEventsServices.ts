import { IRemoteEntity } from "../Entities/Base/IRemoteEntity";
import { PamelloClient } from "../PamelloClient";
import { ReceivedEventJsonDto } from "./Other/RecievedEventJsonDto";

class DestroyableSubscription {
	public isDestroyed: boolean = false;
	public destroy = () => this.isDestroyed = true;
}

export class UpdateSubscription extends DestroyableSubscription {
	constructor(
		public handler: () => Promise<void> | void,
		public watchedEntities: () => (IRemoteEntity | null | undefined)[]
	) {
		super();
	}

	public async invokeAsync(): Promise<void> {
		await this.handler();
	}
}

export class EventSubscription extends DestroyableSubscription {
	constructor(
		public eventName: string,
		public handler: (ev: any) => void
	) {
		super();
	}
}

export class RemoteEventsService {
	private readonly _client: PamelloClient;

	private readonly _eventSubscriptions: EventSubscription[] =[];
	private readonly _updateSubscriptions: UpdateSubscription[] =[];

	// In JS, we process background queues like this:
	private readonly _updateTasks: (() => Promise<void>)[] =[];
	private _isProcessingUpdates = false;

	constructor(client: PamelloClient) {
		this._client = client;
	}

	private async processUpdates() {
		if (this._isProcessingUpdates) return;
		this._isProcessingUpdates = true;

		while (this._updateTasks.length > 0) {
			const task = this._updateTasks.shift();
			if (task) {
				try { await task(); } catch (e) { console.error("Update task failed", e); }
			}
		}
		this._isProcessingUpdates = false;
	}

	public watch(handler: () => Promise<void> | void, watchedEntities: () => (IRemoteEntity | null | undefined)[]): UpdateSubscription {
		const subscription = new UpdateSubscription(handler, watchedEntities);
		this._updateSubscriptions.push(subscription);
		return subscription;
	}

	public subscribe(eventName: string, handler: (ev: any) => void): EventSubscription {
		const subscription = new EventSubscription(eventName, handler);
		this._eventSubscriptions.push(subscription);
		return subscription;
	}

	protected updateFromEvent(eventDto: ReceivedEventJsonDto, ev: any) {
		for (const typeInfo of eventDto.Types) {
			if (!typeInfo.EntityTypeName) continue;

			const id = ev[typeInfo.EntityPropertyName];
			if (typeof id !== 'number') continue;

			const parts = typeInfo.UpdatePropertyName.split('.');
			const lastPart = parts[parts.length - 1];

			const newValue = ev[lastPart];

			const entity = this._client.peql.getSingleByInterfaceName(typeInfo.EntityTypeName, id);
			if (!entity) continue;

			let propertyOwner: any = (entity as IRemoteEntity).Dto;

			if (!propertyOwner) continue;

			let isValidPath = true;
			for (let i = 0; i < parts.length - 1; i++) {
				propertyOwner = propertyOwner[parts[i]];
				if (propertyOwner === undefined || propertyOwner === null) {
					isValidPath = false;
					break;
				}
			}

			if (!isValidPath) continue;

			propertyOwner[lastPart] = newValue;

			for (let i = this._updateSubscriptions.length - 1; i >= 0; i--) {
				const subscription = this._updateSubscriptions[i];

				if (subscription.isDestroyed) {
					this._eventSubscriptions.splice(i, 1);
					continue;
				}

				const watched = subscription.watchedEntities();
				if (watched.includes(entity)) {
					this._updateTasks.push(() => subscription.invokeAsync());
					this.processUpdates();
				}
			}
		}
	}

	public invoke(eventDto: ReceivedEventJsonDto) {
		const ev = eventDto.Data;
		if (!ev) return;

		this.updateFromEvent(eventDto, ev);

		const primaryType = eventDto.Types[0];
		if (primaryType) {
			const eventName = primaryType.Name;

			for (let i = this._eventSubscriptions.length - 1; i >= 0; i--) {
				const subscription = this._eventSubscriptions[i];

				if (subscription.isDestroyed) {
					this._eventSubscriptions.splice(i, 1);
					continue;
				}

				if (subscription.eventName === eventName || subscription.eventName === "*") {
					subscription.handler(ev);
				}
			}
		}
	}
}

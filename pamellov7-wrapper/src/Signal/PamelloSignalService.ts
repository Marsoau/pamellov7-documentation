import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	HttpTransportType
} from "@microsoft/signalr";

import { EventEmitter } from "eventemitter3";
import { IPamelloCommandInvoker } from "../Commands/IPamelloCommandInvoker";
import { ReceivedEventJsonDto } from "../Events/Other/RecievedEventJsonDto";
import { PamelloClient } from "../PamelloClient";
import { RemoteUser } from "../Entities/RemoteUser";

interface PamelloClientEvents {
	"onConnected": (isAutomatic: boolean) => void;
	"onDisconnected": (isAutomatic: boolean) => void;
	"onAuthrorized": (isAutomatic: boolean) => void;
	"onUnauthrorized": (isAutomatic: boolean) => void;
	"onFailedAttempt": (error: Error, attempt: number) => void;
}

export class PamelloSignalService extends EventEmitter<PamelloClientEvents> implements IPamelloCommandInvoker {
	private readonly _client: PamelloClient;

	private _connection: HubConnection | null;
	protected get connection(): HubConnection {
		if (this._connection !== null && this.isConnected) {
			return this._connection;
		}
		throw new Error("NotConnectedPamelloException: SignalR connection is not initiated");
	}

	private _authorizedUser: RemoteUser | null;
	public get authorizedUser(): RemoteUser | null {
		return this._authorizedUser;
	}

	public get isConnected(): boolean {
		return this._connection?.state === HubConnectionState.Connected;
	}

	public get isAuthorized(): boolean {
		return !!this._authorizedUser;
	}

	constructor(client: PamelloClient) {
		super();

		this._client = client;

		this._connection = null;

		this._authorizedUser = null;
	}

	public async connectAsync(isAutomatic: boolean): Promise<HubConnectionState> {
		if (!this._client.config.baseUrl) {
			throw new Error("PamelloException: Base URL is not set");
		}

		this._connection = new HubConnectionBuilder()
			.withUrl(`${this._client.config.baseUrl}/Signal`, {
				transport: HttpTransportType.WebSockets,
				skipNegotiation: true
			})
			.build();

		//maybe just pass that onEvent here
		this._connection.on("Event", (eventDto: ReceivedEventJsonDto) => this.onEvent(eventDto));
		this._connection.onclose(() => {
			this._client.disconnectAsync(true)
		})

		try {
			await this._connection.start();
		}
		catch (e) {
			await this._connection.stop();
			this._connection = null;
			
			throw e;
		}

		if (this.isConnected) this.emit("onConnected", isAutomatic);

		return this._connection.state;
	}

	private onEvent(eventDto: ReceivedEventJsonDto): void {
		console.log("Received event:");
		console.log(eventDto);

		this._client.events.invoke(eventDto);
	}

	public async authorizeAsync(isAutomatic: boolean): Promise<void> {
		if (!this._client.config.token) {
			throw new Error("PamelloException: Token is not set");
		}

		try {
			await this.connection.invoke("Authorize", this._client.config.token);
			this._authorizedUser = await this._client.peql.getSingleAsync(RemoteUser, "me");

			if (this._authorizedUser) this.emit("onAuthrorized", isAutomatic);
		}
		catch (x) {
			this._authorizedUser = null;
			throw x;
		}
	}

	public async unauthorizeAsync(isAutomatic: boolean): Promise<void> {
		console.log(`unauthorizing ${this.isAuthorized}`);
		if (!this.isAuthorized) return;

		try {
			this._authorizedUser = null;

			if (this.isConnected) await this.connection.invoke("Unauthorize");
		}
		finally {
			this._client.config.token = null;
		}

		this.emit("onUnauthrorized", isAutomatic);
	}

	public async disconnectAsync(isAutomatic: boolean): Promise<void> {
		if (!this._connection) return;

		try {
			await this._connection.stop();
		}
		finally {
			this._connection = null;
		}

		this.emit("onDisconnected", isAutomatic);
	}

	public async sendMessage(message: string): Promise<void> {
		await this.connection.invoke("Message", message);
	}

	public async executeCommandPathAsync(commandPath: string): Promise<string> {
		const result = await this.connection.invoke<any>("Command", commandPath);

		if (result !== null && result !== undefined) {
			return typeof result === "object" ? JSON.stringify(result) : String(result);
		}

		return "";
	}

	public async executeCommandPathAsyncT<TType>(commandPath: string): Promise<TType> {
		return this.connection.invoke<TType>("Command", commandPath);
	}
}

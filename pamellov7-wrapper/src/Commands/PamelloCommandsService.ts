import { PamelloRequests } from "./PamelloRequests";
import { PamelloSignal } from "./PamelloSignal";

export class PamelloCommands {
	private readonly _requests: PamelloRequests;
	private readonly _signal?: PamelloSignal;

	constructor(requests: PamelloRequests, signal?: PamelloSignal) {
		this._requests = requests;
		this._signal = signal;
	}
}

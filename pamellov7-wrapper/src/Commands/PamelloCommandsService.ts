import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { PamelloSignalService } from "../Signal/PamelloSignalService";

export class PamelloCommandsService {
	private readonly _requests: PamelloRequestsService;
	private readonly _signal?: PamelloSignalService;

	constructor(requests: PamelloRequestsService, signal?: PamelloSignalService) {
		this._requests = requests;
		this._signal = signal;
	}
}

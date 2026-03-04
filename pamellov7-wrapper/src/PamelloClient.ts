import { PamelloCommands as PamelloCommandsService } from "./Commands/PamelloCommandsService";
import { PamelloConfig as PamelloClientConfig } from "./Config/PamelloClientConfig";
import { PamelloEvents as PamelloEventsService } from "./Events/PamelloEventsServices";
import { PamelloRequests as PamelloRequestsService } from "./Requests/PamelloRequestsService";
import { PamelloSignal as PamelloSignalService } from "./Signal/PamelloSignalService";

export class PamelloClient {
	public readonly Config: PamelloClientConfig;
	
	public readonly Events: PamelloEventsService;

	public readonly Requests: PamelloRequestsService;
	public readonly Signal: PamelloSignalService;
	public readonly Commands: PamelloCommandsService;

	//todo repositories here

	//todo peql here

	constructor() {
		this.Config = new PamelloClientConfig();

		this.Events = new PamelloEventsService(this);

		this.Requests = new PamelloRequestsService(this.Config);
		this.Signal = new PamelloSignalService(this);
		this.Commands = new PamelloCommandsService(this.Requests, this.Signal);

	}
}

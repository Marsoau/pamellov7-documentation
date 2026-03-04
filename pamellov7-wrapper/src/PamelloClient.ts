import { PamelloCommandsService } from "./Commands/PamelloCommandsService";
import { PamelloClientConfig } from "./Config/PamelloClientConfig";
import { PamelloEventsService } from "./Events/PamelloEventsServices";
import { PamelloRequestsService } from "./Requests/PamelloRequestsService";
import { PamelloSignalService } from "./Signal/PamelloSignalService";

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

		this.Config.baseUrl = "https://server.tpamello.marsoau.com";
		this.Config.token = "9a40ad25-7e80-43c1-bdd9-a7a84218db5d";

		this.Events = new PamelloEventsService(this);

		this.Requests = new PamelloRequestsService(this.Config);
		this.Signal = new PamelloSignalService(this.Config, this.Events);
		this.Commands = new PamelloCommandsService(this.Requests, this.Signal);
	}
}

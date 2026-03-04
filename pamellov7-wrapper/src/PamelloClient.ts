import { EventEmitter } from "eventemitter3";
import { PamelloCommandsService } from "./Commands/PamelloCommandsService";
import { PamelloClientConfig } from "./Config/PamelloClientConfig";
import { PamelloEventsService } from "./Events/PamelloEventsServices";
import { PamelloRequestsService } from "./Requests/PamelloRequestsService";
import { PamelloSignalService } from "./Signal/PamelloSignalService";
import { UserRemoteRepository } from "./Repositories/UserRemoteRepository";

interface PamelloClientEvents {
	"onConnected": () => void;
	"onDisconnected": () => void;
	"onAuthrorized": () => void;
	"onUnauthrorized": () => void;
}

export class PamelloClient extends EventEmitter<PamelloClientEvents> {
	public readonly config: PamelloClientConfig;
	
	public readonly events: PamelloEventsService;

	public readonly requests: PamelloRequestsService;
	public readonly signal: PamelloSignalService;
	public readonly commands: PamelloCommandsService;

	//todo repositories here
	public readonly users: UserRemoteRepository;

	//todo peql here

	constructor() {
		super();

		console.log("recreated");

		this.config = new PamelloClientConfig();

		this.events = new PamelloEventsService(this);

		this.requests = new PamelloRequestsService(this.config);
		this.signal = new PamelloSignalService(this.config, this.events);
		this.commands = new PamelloCommandsService(this.requests, this.signal);

		this.users = new UserRemoteRepository(this.requests);
	}

	public async connectAsync(url: string) {
		if (this.signal.isConnected) throw new Error("Already connected");
		
		this.config.baseUrl = url;

		await this.signal.connectAsync();

		if (this.signal.isConnected) this.emit("onConnected");
	}

	public async authorizeAsync(token: string) {
		if (!this.signal.isConnected) throw new Error("Not connected");
		if (this.signal.isAuthorized) throw new Error("Already authorized");

		this.config.token = token;

		try {
			await this.signal.authorizeAsync();
		}
		catch {
			this.config.token = null;
		}

		if (this.signal.isAuthorized) this.emit("onAuthrorized");
	}

	public async unauthorizeAsync() {
		if (!this.signal.isConnected) throw new Error("Not connected");

		try {
			await this.signal.unauthorizeAsync();
		}
		finally {
			this.config.token = null;
		}

		if (!this.signal.isAuthorized) this.emit("onUnauthrorized");
	}

	public async disconnectAsync() {
		if (!this.signal.isConnected) throw new Error("Not connected");

		await this.signal.unauthorizeAsync();
		await this.signal.disconnectAsync();

		//peql clear cache
		
		if (!this.signal.isAuthorized) this.emit("onUnauthrorized");
		if (!this.signal.isConnected) this.emit("onDisconnected");
	}
}

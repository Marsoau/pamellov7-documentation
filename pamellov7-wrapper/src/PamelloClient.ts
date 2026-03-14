import { EventEmitter } from "eventemitter3";
import { PamelloCommandsService } from "./Commands/PamelloCommandsService";
import { PamelloClientConfig } from "./Config/PamelloClientConfig";
import { PamelloRequestsService } from "./Requests/PamelloRequestsService";
import { PamelloSignalService } from "./Signal/PamelloSignalService";
import { UserRemoteRepository } from "./Repositories/UserRemoteRepository";
import { RemoteEntityQueryService } from "./Query/RemoteEntityQueryService";
import { RemoteEventsService } from "./Events/PamelloEventsServices";
import { SongRemoteRepository } from "./Repositories/SongRemoteRepository";
import { EpisodeRemoteRepository } from "./Repositories/EpisodeRemoteRepository";
import { PlaylistRemoteRepository } from "./Repositories/PlaylistRemoteRepository";
import { PlayerRemoteRepository } from "./Repositories/PlayerRemoteRepository";

interface PamelloClientEvents {
	"onConnected": (isAutomatic: boolean) => void;
	"onDisconnected": (isAutomatic: boolean) => void;
	"onAuthrorized": (isAutomatic: boolean) => void;
	"onUnauthrorized": (isAutomatic: boolean) => void;
	"onFailedAttempt": (error: Error, attempt: number) => void;
}

export class PamelloClient extends EventEmitter<PamelloClientEvents> {
	public readonly config: PamelloClientConfig;
	
	public readonly events: RemoteEventsService;

	public readonly requests: PamelloRequestsService;
	public readonly signal: PamelloSignalService;
	public readonly commands: PamelloCommandsService;

	public readonly users: UserRemoteRepository;
	public readonly songs: SongRemoteRepository;
	public readonly episodes: EpisodeRemoteRepository;
	public readonly playlists: PlaylistRemoteRepository;
	public readonly players: PlayerRemoteRepository;


	public readonly peql: RemoteEntityQueryService;

	constructor() {
		super();

		console.log("recreated");

		this.config = new PamelloClientConfig();

		this.events = new RemoteEventsService(this);

		this.requests = new PamelloRequestsService(this.config);
		this.signal = new PamelloSignalService(this);
		this.commands = new PamelloCommandsService(this.requests, this.signal);

		this.users = new UserRemoteRepository(this.requests);
		this.songs = new SongRemoteRepository(this.requests);
		this.episodes = new EpisodeRemoteRepository(this.requests);
		this.playlists = new PlaylistRemoteRepository(this.requests);
		this.players = new PlayerRemoteRepository(this.requests);

		this.peql = new RemoteEntityQueryService(this);
	}

	public async startConnectionAttemptsAsync(url: string, maxAttempts: number = -1, delay: number = 1000) {
		for (let attempt = 0; maxAttempts < 0 || attempt < maxAttempts; attempt++) {
			try {
				await this.connectAsync(url, true);
				return;
			}
			catch (e: any) {
				this.emit("onFailedAttempt", e, attempt);

				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}

	public async connectAsync(url: string, isAutomatic: boolean = false) {
		if (this.signal.isConnected) throw new Error("Already connected");
		
		this.config.baseUrl = url;

		await this.signal.connectAsync();

		if (this.signal.isConnected) this.emit("onConnected", isAutomatic);
	}

	public async authorizeAsync(token: string, isAutomatic: boolean = false) {
		if (!this.signal.isConnected) throw new Error("Not connected");
		if (this.signal.isAuthorized) throw new Error("Already authorized");

		this.config.token = token;

		try {
			await this.signal.authorizeAsync();
		}
		catch {
			this.config.token = null;
		}

		if (this.signal.isAuthorized) this.emit("onAuthrorized", isAutomatic);
	}

	public async unauthorizeAsync(isAutomatic: boolean = false) {
		if (!this.signal.isConnected) throw new Error("Not connected");

		try {
			await this.signal.unauthorizeAsync();
		}
		finally {
			this.peql.clearCache();
			this.config.token = null;
			if (!this.signal.isAuthorized) this.emit("onUnauthrorized", isAutomatic);
		}
	}

	public async disconnectAsync(isAutomatic: boolean = false) {
		await this.unauthorizeAsync();
		await this.signal.disconnectAsync();

		if (!this.signal.isConnected) this.emit("onDisconnected", isAutomatic);
	}
}

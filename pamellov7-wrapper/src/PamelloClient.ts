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

export class PamelloClient {
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

	public async connectAsync(url: string, isAutomatic: boolean = false) {
		if (this.signal.isConnected) throw new Error("Already connected");
		
		this.config.baseUrl = url;

		await this.signal.connectAsync(isAutomatic);
	}

	public async authorizeAsync(token: string, isAutomatic: boolean = false) {
		if (!this.signal.isConnected) throw new Error("Not connected");
		if (this.signal.isAuthorized) throw new Error("Already authorized");

		this.config.token = token;

		try {
			await this.signal.authorizeAsync(isAutomatic);
		}
		catch {
			this.config.token = null;
		}
	}

	public async unauthorizeAsync(isAutomatic: boolean = false) {
		try {
			await this.signal.unauthorizeAsync(isAutomatic);
		}
		finally {
			this.peql.clearCache();
			this.config.token = null;
		}
	}

	public async disconnectAsync(isAutomatic: boolean = false) {
		try {
			await this.unauthorizeAsync();
			await this.signal.disconnectAsync(isAutomatic);
		}
		finally {
			this.config.baseUrl = null;
		}
	}
}

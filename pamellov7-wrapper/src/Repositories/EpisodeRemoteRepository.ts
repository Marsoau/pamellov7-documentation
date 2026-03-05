import { RemoteEpisode } from "../Entities/RemoteEpisode";
import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { RemoteRepository } from "./Base/RemoteRepository";

export class EpisodeRemoteRepository extends RemoteRepository<RemoteEpisode> {
	constructor(
        requests: PamelloRequestsService,
	) {
		super(requests, RemoteEpisode);
	}
}

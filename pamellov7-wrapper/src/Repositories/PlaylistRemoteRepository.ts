import { RemotePlaylist } from "../Entities/RemotePlaylist";
import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { RemoteRepository } from "./Base/RemoteRepository";

export class PlaylistRemoteRepository extends RemoteRepository<RemotePlaylist> {
	constructor(
        requests: PamelloRequestsService,
	) {
		super(requests, RemotePlaylist);
	}
}

import { RemoteSong } from "../Entities/RemoteSong";
import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { RemoteRepository } from "./Base/RemoteRepository";

export class SongRemoteRepository extends RemoteRepository<RemoteSong> {
	constructor(
        requests: PamelloRequestsService,
	) {
		super(requests, RemoteSong);
	}
}

import { RemotePlayer } from "../Entities/RemotePlayer";
import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { RemoteRepository } from "./Base/RemoteRepository";

export class PlayerRemoteRepository extends RemoteRepository<RemotePlayer> {
	constructor(
        requests: PamelloRequestsService,
	) {
		super(requests, RemotePlayer);
	}
}

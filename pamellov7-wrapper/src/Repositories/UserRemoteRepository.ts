import { IRemoteEntityMetadata } from "../Entities/Base/IRemoteEntityMetadata";
import { RemoteUser } from "../Entities/RemoteUser";
import { PamelloRequestsService } from "../Requests/PamelloRequestsService";
import { RemoteRepository } from "./Base/RemoteRepository";

export class UserRemoteRepository extends RemoteRepository<RemoteUser> {
	constructor(
        requests: PamelloRequestsService,
	) {
		super(requests, RemoteUser);
	}
}

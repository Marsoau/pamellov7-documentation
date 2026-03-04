import { PamelloClient } from "../PamelloClient";

export class PamelloEvents {
	private readonly client: PamelloClient
	constructor(client: PamelloClient) {
		this.client = client;
	}
}

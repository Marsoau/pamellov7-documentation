import { PamelloClient } from "../PamelloClient";
import { ReceivedEventJsonDto } from "./Other/RecievedEventJsonDto";

export class PamelloEventsService {
	private readonly client: PamelloClient

	constructor(client: PamelloClient) {
		this.client = client;
	}

	public invoke(eventDto: ReceivedEventJsonDto) {
	}
}

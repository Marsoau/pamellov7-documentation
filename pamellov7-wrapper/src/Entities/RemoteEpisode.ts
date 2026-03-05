import { PamelloEpisodeDto } from "../Dto/Entities/PamelloEpisodeDto";
import { RemoteEntity } from "./Base/RemoteEntity";

export class RemoteEpisode extends RemoteEntity<PamelloEpisodeDto> {
	public static providerName = "episodes";
    public static remoteInterfaceName = "IPamelloEpisode";
    public static dtoType = PamelloEpisodeDto;

	constructor(dto: PamelloEpisodeDto) {
		super(dto);
	}
}

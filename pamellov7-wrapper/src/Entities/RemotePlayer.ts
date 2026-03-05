import { PamelloPlayerDto } from "../Dto/Entities/PamelloPlayerDto";
import { RemoteEntity } from "./Base/RemoteEntity";

export class RemotePlayer extends RemoteEntity<PamelloPlayerDto> {
	public static providerName = "players";
    public static remoteInterfaceName = "IPamelloPlayer";
    public static dtoType = PamelloPlayerDto;

	constructor(dto: PamelloPlayerDto) {
		super(dto);
	}
}

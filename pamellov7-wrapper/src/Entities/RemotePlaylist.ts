import { PamelloPlaylistDto } from "../Dto/Entities/PamelloPlaylistDto";
import { RemoteEntity } from "./Base/RemoteEntity";

export class RemotePlaylist extends RemoteEntity<PamelloPlaylistDto> {
	public static providerName = "playlists";
    public static remoteInterfaceName = "IPamelloPlaylist";
    public static dtoType = PamelloPlaylistDto;

	constructor(dto: PamelloPlaylistDto) {
		super(dto);
	}
}

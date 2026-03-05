import { PamelloSongDto } from "../Dto/Entities/PamelloSongDto";
import { RemoteEntity } from "./Base/RemoteEntity";

export class RemoteSong extends RemoteEntity<PamelloSongDto> {
	public static providerName = "songs";
    public static remoteInterfaceName = "IPamelloSong";
    public static dtoType = PamelloSongDto;

	constructor(dto: PamelloSongDto) {
		super(dto);
	}
}

import { PamelloUserDto } from "../Dto/Entities/PamelloUserDto";
import { RemoteEntity } from "./Base/RemoteEntity";

export class RemoteUser extends RemoteEntity<PamelloUserDto> {
	public static providerName = "users";
    public static remoteInterfaceName = "IPamelloUser";
    public static dtoType = PamelloUserDto;

	constructor(dto: PamelloUserDto) {
		super(dto);
	}
}

import { PamelloEntityDto } from "../../Dto/Entities/Base/PamelloEntityDto";

export interface IRemoteEntity {
	get Id(): number;
	get Name(): string;

	get Dto(): PamelloEntityDto;
}

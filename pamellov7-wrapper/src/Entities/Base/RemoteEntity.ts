import { PamelloEntityDto } from "../../Dto/Entities/Base/PamelloEntityDto";
import { IRemoteEntity } from "./IRemoteEntity"

export abstract class RemoteEntity<TDtoType extends PamelloEntityDto> implements IRemoteEntity {
	private _dto: TDtoType;
	public get Dto(): TDtoType {
		return this._dto;
	}

	public get Id(): number {
		return this._dto.Id;
	};
	public get Name(): string {
		return this._dto.Name;
	};

	constructor(dto: TDtoType) {
		this._dto = dto;
	}
}

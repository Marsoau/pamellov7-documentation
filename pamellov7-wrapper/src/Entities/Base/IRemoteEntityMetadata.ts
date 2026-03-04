import { PamelloEntityDto } from "../../Dto/Entities/Base/PamelloEntityDto";
import { IRemoteEntity } from "./IRemoteEntity"

export interface IRemoteEntityMetadata<T extends IRemoteEntity> {
    // 1. The constructor (replacing Activator.CreateInstance)
    new (dto: any): T; 

    // 2. The metadata (replacing the Attribute properties)
    providerName: string;
    remoteInterfaceName: string;
    dtoType: new (...args: any[]) => any;
}

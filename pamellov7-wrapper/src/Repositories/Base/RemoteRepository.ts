import { IRemoteEntity } from "../../Entities/Base/IRemoteEntity";
import { IRemoteEntityMetadata } from "../../Entities/Base/IRemoteEntityMetadata";
import { PamelloRequestsService } from "../../Requests/PamelloRequestsService";

export abstract class RemoteRepository<TEntityType extends IRemoteEntity> {
    private readonly _requests: PamelloRequestsService;
    private readonly _loaded: TEntityType[];

    // Exposed Metadata Properties
    public readonly providerName: string;
    public readonly remoteInterfaceName: string;
    public readonly dtoType: any;
    public readonly entityType: IRemoteEntityMetadata<TEntityType>;

    constructor(
        requests: PamelloRequestsService, 
        entityType: IRemoteEntityMetadata<TEntityType> // We pass the Class in here
    ) {
        this._requests = requests;
        this._loaded =[];
        this.entityType = entityType;

        this.providerName = entityType.providerName;
        this.remoteInterfaceName = entityType.remoteInterfaceName;
        this.dtoType = entityType.dtoType;

        if (!this.providerName) {
            throw new Error(`Missing static providerName on entity ${entityType.name}`);
        }
    }

    public load(dto: any): TEntityType { // Use PamelloEntityDto type here if you have it
        let entity = this.getSingle(dto.id);
        if (entity) return entity;

        entity = new this.entityType(dto); 
        if (!entity) throw new Error(`Could not create instance of ${this.entityType.name}`);

        this._loaded.push(entity);
        return entity;
    }

    public getSingle(id: number): TEntityType | null {
        return this._loaded.find(x => x.Id === id) ?? null;
    }

    public async getSingleAsync(id: number): Promise<TEntityType | null>;
    public async getSingleAsync(query: string): Promise<TEntityType | null>;
    public async getSingleAsync(idOrQuery: number | string): Promise<TEntityType | null> {
        if (typeof idOrQuery === 'number') {
            const entity = this.getSingle(idOrQuery);
            if (entity) return entity;

            return await this.getSingleAsync(idOrQuery.toString());
        }

        const result = await this._requests.getEntitiesAsync(this.dtoType, `${this.providerName}$${idOrQuery}`);
        const firstDto = result[0];
        if (!firstDto) return null;

        return this.load(firstDto);
    }

    public async getAsync(query: string): Promise<TEntityType[]> {
        const results = await this._requests.getEntitiesAsync(this.dtoType, `${this.providerName}$${query}`);
        return results.map(dto => this.load(dto));
    }

    public async getIdsAsync(query: string): Promise<number[]> {
        return await this._requests.getEntitiesIdsAsync(`${this.providerName}$${query}`);
    }

    public getSingleRequired(id: number): TEntityType {
        const entity = this.getSingle(id);
        if (!entity) throw new Error(`${this.entityType.name} with id ${id} not found`); 

        return entity;
    }

    public async getSingleRequiredAsync(id: number): Promise<TEntityType> {
        const entity = await this.getSingleAsync(id);
        if (!entity) throw new Error(`${this.entityType.name} with id ${id} not found`);

        return entity;
    }

    public clearCache(): void {
        this._loaded.length = 0; 
    }
}

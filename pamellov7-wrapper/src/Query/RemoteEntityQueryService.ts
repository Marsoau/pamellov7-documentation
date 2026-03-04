import { IRemoteEntity } from "../Entities/Base/IRemoteEntity";
import { PamelloClient } from "../PamelloClient";
import { RemoteRepository } from "../Repositories/Base/RemoteRepository";
import { ClassType, AbstractRemoteEntityQueryService } from "./Base/IRemoteEntityQueryService";

export class RemoteEntityQueryService extends AbstractRemoteEntityQueryService {
    private readonly _repositories: RemoteRepository<any>[];

    constructor(client: PamelloClient) {
        super(); // Must call super() when extending a class in TS
        this._repositories = [
            client.users,
            // client.songs,
            // client.episodes,
            // client.playlists,
            // client.players
        ];
    }

    private getRepository<T extends IRemoteEntity>(type: ClassType<T>): RemoteRepository<T> | null {
        return (this._repositories.find(x => x.entityType === type) as RemoteRepository<T>) ?? null;
    }

    private getRepositoryRequired<T extends IRemoteEntity>(type: ClassType<T>): RemoteRepository<T> {
        const repo = this.getRepository(type);
        if (!repo) throw new Error(`No repository for type ${type.name}`);
        return repo;
    }

    public getSingle<T extends IRemoteEntity>(type: ClassType<T>, id: number): T | null {
        return this.getRepositoryRequired(type).getSingle(id);
    }

    public getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, id: number): Promise<T | null>;
    public getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T | null>;
    public getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, idOrQuery: number | string): Promise<T | null> {
        return this.getRepositoryRequired(type).getSingleAsync(idOrQuery as any);
    }

    public getAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T[]> {
        return this.getRepositoryRequired(type).getAsync(query);
    }

    public getIdsAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<number[]> {
        return this.getRepositoryRequired(type).getIdsAsync(query);
    }

    public getAsyncGlobal(query: string): Promise<IRemoteEntity[]> {
        throw new Error("Not implemented");
    }

    public getSingleByInterfaceName(interfaceName: string, id: number): IRemoteEntity | null {
        const repo = this._repositories.find(r => r.remoteInterfaceName === interfaceName);
        if (!repo) return null;

        return repo.getSingle(id);
    }

    public clearCache(): void {
        for (const repository of this._repositories) {
            repository.clearCache();
        }
    }
}

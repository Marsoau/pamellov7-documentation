import { IRemoteEntity } from "../../Entities/Base/IRemoteEntity"

export type ClassType<T = any> = new (...args: any[]) => T;

export interface IRemoteEntityQueryService {
    getSingleRequired<T extends IRemoteEntity>(type: ClassType<T>, id: number): T;
    getSingleRequiredAsync<T extends IRemoteEntity>(type: ClassType<T>, id: number): Promise<T>;
    getSingleRequiredAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T>;

    getSingle<T extends IRemoteEntity>(type: ClassType<T>, id: number): T | null;
    getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, id: number): Promise<T | null>;
    getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T | null>;

    getAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T[]>;
    getIdsAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<number[]>;

    getAsyncGlobal(query: string): Promise<IRemoteEntity[]>; 
}

export abstract class AbstractRemoteEntityQueryService implements IRemoteEntityQueryService {
    abstract getSingle<T extends IRemoteEntity>(type: ClassType<T>, id: number): T | null;
    abstract getSingleAsync<T extends IRemoteEntity>(type: ClassType<T>, idOrQuery: number | string): Promise<T | null>;
    abstract getAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T[]>;
    abstract getIdsAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<number[]>;
    abstract getAsyncGlobal(query: string): Promise<IRemoteEntity[]>;

    abstract clearCache(): void;

    public getSingleRequired<T extends IRemoteEntity>(type: ClassType<T>, id: number): T {
        const entity = this.getSingle(type, id);
        if (!entity) throw new Error(`Entity ${type.name} with id ${id} not found`);
        return entity;
    }

    public getSingleRequiredAsync<T extends IRemoteEntity>(type: ClassType<T>, id: number): Promise<T>;
    public getSingleRequiredAsync<T extends IRemoteEntity>(type: ClassType<T>, query: string): Promise<T>;
    public async getSingleRequiredAsync<T extends IRemoteEntity>(type: ClassType<T>, idOrQuery: number | string): Promise<T> {
        const entity = await this.getSingleAsync(type, idOrQuery as any);
        if (!entity) throw new Error(`Entity ${type.name} with id/query ${idOrQuery} not found`);
        return entity;
    }
}

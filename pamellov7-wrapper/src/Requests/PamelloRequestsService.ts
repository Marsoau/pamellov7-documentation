import { PamelloClientConfig } from "../Config/PamelloClientConfig";

export class PamelloRequestsService {
    private readonly _config: PamelloClientConfig;

    constructor(config: PamelloClientConfig) {
        this._config = config;
        // In TS/JS, we don't need an IHttpClientFactory. 
        // The native `fetch` API handles connection pooling automatically.
    }

    public async getAsync(url: string, requireUser: boolean = false): Promise<Response> {
        if (!this._config.baseUrl) {
            throw new Error("BaseUrl of PamelloClientConfig wasnt set");
        }

        const fullUrl = `${this._config.baseUrl}/${url}`;
        const headers: Record<string, string> = {};

        if (this._config.token) {
            headers["user"] = this._config.token;
        } else if (requireUser) {
            throw new Error("User token is not provided");
        }

        // Equivalent to HttpClient.SendAsync
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: headers
        });

        if (response.status === 502) { // HttpStatusCode.BadGateway
            throw new Error(`"BadGateway" trying to request: ${fullUrl}`);
        }
        
        if (!response.ok) { // !response.IsSuccessStatusCode
            const errorContent = await response.text();
            throw new Error(errorContent);
        }

        return response;
    }

    public async getFromJsonAsync<T>(url: string, requireUser: boolean = false): Promise<T> {
        const response = await this.getAsync(url, requireUser);
        const content = await response.text();
        
        // console.debug(`Content to read as json: ${content}`);

        if (content.length > 0) {
            return JSON.parse(content) as T;
        }
        
        throw new Error(`Cannot read response as JSON from ${url}`);
    }

    public async pingAsync(): Promise<boolean> {
        try {
            const response = await this.getAsync("Ping");
            return response.ok;
        } catch (error) {
			return false;
        }
    }

    public async executeCommandPathAsync(commandPath: string): Promise<string> {
        const response = await this.getAsync(`Command/${commandPath}`);
        return await response.text();
    }

    public async executeCommandPathJsonAsync<T>(commandPath: string): Promise<T> {
        return await this.getFromJsonAsync<T>(`Command/${commandPath}`);
    }

    // --- Data Queries ---

    // Using Method Overloading to support both the TS and C# Repository calls
    public async getEntitiesAsync<T = any>(query: string): Promise<T[]>;
    public async getEntitiesAsync<T = any>(dtoType: any, query: string): Promise<T[]>;
    public async getEntitiesAsync<T = any>(dtoTypeOrQuery: any, query?: string): Promise<T[]> {
        // If query is provided, they used the (dtoType, query) signature.
        // Otherwise, they used the (query) signature.
        const actualQuery = query !== undefined ? query : dtoTypeOrQuery;
        
        // TS automatically parses the array of objects, no need to do MakeGenericType!
        return await this.getFromJsonAsync<T[]>(`Data/${actualQuery}`);
    }

    public async getEntitiesIdsAsync(query: string, typeName?: string): Promise<number[]> {
        const typeParam = typeName ? `&type=${typeName}` : "";
        const url = `Data/${query}?view=Ids${typeParam}`;
        
        return await this.getFromJsonAsync<number[]>(url);
    }

	/*
    public async getEntitiesDetailedAsync(query: string, typeName?: string): Promise<DtoDescription[]> {
        const typeParam = typeName ? `&type=${typeName}` : "";
        const url = `Data/${query}?view=Detailed${typeParam}`;
        
        return []//await this.getFromJsonAsync<DtoDescription[]>(url);
    }
	*/
}

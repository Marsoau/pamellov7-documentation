import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    HttpTransportType
} from "@microsoft/signalr";

import { PamelloClient } from "../PamelloClient";
import { IPamelloCommandInvoker } from "./IPamelloCommandInvoker";

export interface ReceivedEventJsonDto {
    type: { name: string };
    data: any;
}

export class PamelloSignal implements IPamelloCommandInvoker {
    private readonly _client: PamelloClient;
    private _connection: HubConnection | null;

    constructor(client: PamelloClient) {
        this._client = client;
        this._connection = null;
    }

    // Equivalent to protected HubConnection Connection => ...
    protected get connection(): HubConnection {
        if (this._connection !== null && this.isConnected) {
            return this._connection;
        }
        throw new Error("NotConnectedPamelloException: SignalR connection is not initiated");
    }

    public get isConnected(): boolean {
        return this._connection?.state === HubConnectionState.Connected;
    }

    public async connectAsync(): Promise<HubConnectionState> {
        if (!this._client.Config.baseUrl) {
            throw new Error("PamelloException: Base URL is not set");
        }

        // Initialize connection with SignalR configuration
        this._connection = new HubConnectionBuilder()
            .withUrl(`${this._client.Config.baseUrl}/Signal`, {
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true
            })
            .withAutomaticReconnect()
            .build();

        // Use arrow function to preserve 'this' context
        this._connection.on("Event", (eventDto: ReceivedEventJsonDto) => this.onEvent(eventDto));

        await this._connection.start();

        return this._connection.state;
    }

    private onEvent(eventDto: ReceivedEventJsonDto): void {
        console.log(`Received event: ${eventDto.type.name} ${eventDto.data}`);
        this._client.Events.invoke(eventDto);
    }

    public async authorizeAsync(): Promise<void> {
        if (!this._client.Config.token) {
            throw new Error("PamelloException: Token is not set");
        }

        await this.connection.invoke("Authorize", this._client.Config.token);
    }

    public async disconnectAsync(): Promise<void> {
        if (!this._connection) return;

        await this._connection.stop();
        this._connection = null;
    }

    public async sendMessage(message: string): Promise<void> {
        await this.connection.invoke("Message", message);
    }

    public async executeCommandPathAsync(commandPath: string): Promise<string> {
        const result = await this.connection.invoke<any>("Command", commandPath);

        if (result !== null && result !== undefined) {
            return typeof result === "object" ? JSON.stringify(result) : String(result);
        }

        return "";
    }
    public async executeCommandPathAsyncT<TType>(commandPath: string): Promise<TType> {
        return this.connection.invoke<TType>("Command", commandPath);
    }
}

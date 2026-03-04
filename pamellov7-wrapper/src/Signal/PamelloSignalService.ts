import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    HttpTransportType
} from "@microsoft/signalr";

import { IPamelloCommandInvoker } from "../Commands/IPamelloCommandInvoker";
import { PamelloClientConfig } from "../Config/PamelloClientConfig";
import { PamelloEventsService } from "../Events/PamelloEventsServices";
import { ReceivedEventJsonDto } from "../Events/Other/RecievedEventJsonDto";

export class PamelloSignalService implements IPamelloCommandInvoker {
	private readonly _config: PamelloClientConfig;
	private readonly _events: PamelloEventsService;

    private _connection: HubConnection | null;
    protected get connection(): HubConnection {
        if (this._connection !== null && this.isConnected) {
            return this._connection;
        }
        throw new Error("NotConnectedPamelloException: SignalR connection is not initiated");
    }

    public get isConnected(): boolean {
        return this._connection?.state === HubConnectionState.Connected;
    }

	private _isAuthorized: boolean;
    public get isAuthorized(): boolean {
		return this._isAuthorized;
    }

    constructor(config: PamelloClientConfig, events: PamelloEventsService) {
		this._config = config;
		this._events = events;

		this._connection = null;

		this._isAuthorized = false;
    }

    public async connectAsync(): Promise<HubConnectionState> {
        if (!this._config.baseUrl) {
            throw new Error("PamelloException: Base URL is not set");
        }

        // Initialize connection with SignalR configuration
        this._connection = new HubConnectionBuilder()
            .withUrl(`${this._config.baseUrl}/Signal`, {
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
        console.log("Received event:");
        console.log(eventDto);

        this._events.invoke(eventDto);
    }

    public async authorizeAsync(): Promise<void> {
        if (!this._config.token) {
            throw new Error("PamelloException: Token is not set");
        }

		try {
			await this.connection.invoke("Authorize", this._config.token);
			this._isAuthorized = true;
		}
		catch (x) {
			this._isAuthorized = false;
			throw x;
		}
    }

    public async unauthorizeAsync(): Promise<void> {
        if (!this._isAuthorized) return;

		this._isAuthorized = false;
		await this.connection.invoke("Unauthorize");
    }

    public async disconnectAsync(): Promise<void> {
        if (!this._connection) return;

		this._isAuthorized = false;

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

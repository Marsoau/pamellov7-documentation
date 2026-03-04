import { request } from "http";
import { PamelloConfig } from "../Config/PamelloConfig";
import { UserRequiredError } from "../Errors/UserRequiredError";
import { IPamelloCommandInvoker } from "./IPamelloCommandInvoker";

export class PamelloRequests implements IPamelloCommandInvoker {
	private readonly _config: PamelloConfig;

	constructor(config: PamelloConfig) {
		this._config = config;
	}

	public async request(endpoint: string): Promise<string> {
		if (!this._config.baseUrl) throw new Error("BaseUrl is not set before making request");

		const headers = new Headers();
		if (this._config.token) {
			headers.set('user', this._config.token);
		}

		const response = await fetch(`${this._config.baseUrl}/${endpoint}`, {
			headers,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.log("error", response.status)
			console.log(errorText)
			if (response.status == 401) {
				throw new UserRequiredError(errorText || "User required to make this request");
			}
			else throw new Error(errorText || "An API error with empty response occurred");
		}

		const responseText = await response.text();
		console.log("not error")
		console.log(responseText)
		if (!responseText) {
			return "";
		}

		return responseText;
	}
	public async requestType<TReturnType>(endpoint: string): Promise<TReturnType> {
		var responseText = await this.request(endpoint);
		return JSON.parse(responseText) as TReturnType;
	}

    public executeCommandPathAsync(commandPath: string): Promise<string> {
		return this.request(`Command/${commandPath}`);
	}
    public executeCommandPathAsyncT<TType>(commandPath: string): Promise<TType> {
		return this.requestType<TType>(`Command/${commandPath}`);
	}
}


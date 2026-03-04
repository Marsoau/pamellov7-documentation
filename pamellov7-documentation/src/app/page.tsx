"use client"

import { request } from "http";
import { useEffect, useState } from "react";
import { PamelloClientConfig } from "../../../pamellov7-wrapper/dist/Config/PamelloClientConfig";
import { PamelloRequestsService } from "../../../pamellov7-wrapper/dist/Requests/PamelloRequestsService";
import { PamelloClient, UserRequiredError } from "pamellov7-wrapper";

interface asd {
	name: string;
}

export default function Home() {
	const client = new PamelloClient();
	const [text, setText] = useState("");

	useEffect(() => {
		const asyncRequest = async () => {
			console.log(client.Signal.isConnected);
			console.log(client.Signal.isAuthorized);

			console.log("connecting");
			await client.Signal.connectAsync();

			console.log(client.Signal.isConnected);

			console.log("authorizing");
			await client.Signal.authorizeAsync();

			console.log(client.Signal.isAuthorized);

			console.log("unauthorizing");
			await client.Signal.unauthorizeAsync();

			console.log("disconnecting");
			await client.Signal.disconnectAsync();
		}

		asyncRequest();
	}, [])


	return <div>
		Test {text}
	</div>;
}

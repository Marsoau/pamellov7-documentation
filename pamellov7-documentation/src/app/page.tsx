"use client"

import { request } from "http";
import { useEffect, useState } from "react";
import { PamelloClientConfig } from "../../../pamellov7-wrapper/dist/Config/PamelloClientConfig";
import { PamelloRequestsService } from "../../../pamellov7-wrapper/dist/Requests/PamelloRequestsService";
import { PamelloClient } from "pamellov7-wrapper";

export default function Home() {
	const [text, setText] = useState("");

	useEffect(() => {
		const client = new PamelloClient();

		client.on("onConnected", () => console.log("Connected"));
		client.on("onDisconnected", () => console.log("Disconnected"));

		client.on("onAuthrorized", () => console.log("Authorized"));
		client.on("onUnauthrorized", () => console.log("Unauthorized"));

		const asyncRequest = async () => {
			await client.connectAsync("https://server.tpamello.marsoau.com");
			await client.authorizeAsync("9a40ad25-7e80-43c1-bdd9-a7a84218db5d");

			await client.disconnectAsync();
		}

		asyncRequest();
	}, [])


	return <div>
		Test {text}
	</div>;
}

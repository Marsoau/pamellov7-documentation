"use client"

import { request } from "http";
import { PamelloConfig, PamelloRequests, UserRequiredError } from "pamellov7-wrapper";
import { useEffect, useState } from "react";

interface asd {
	name: string;
}

export default function Home() {
	const [text, setText] = useState("");

	useEffect(() => {
		const config = new PamelloConfig();
		config.baseUrl = "https://server.tpamello.marsoau.com";
		config.token = "9a40ad25-7e80-43c1-bdd9-a7a84218db5d";

		const requests = new PamelloRequests(config);

		const asyncRequest = async () => {
			try {
				const response = await requests.requestType<asd>("Data/users$me?single=true");

				console.log(response);

				setText(response.name ?? "nah");
			}
			catch (x) {
				if (x instanceof UserRequiredError) {
					setText("unauthorized");
				}
				else if (x instanceof Error) {
					setText(`Error: ${x.message}`);
				}
			}
		}

		asyncRequest();
	}, [])


	return <div>
		Test {text}
	</div>;
}

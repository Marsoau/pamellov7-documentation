"use client"

import { RemoteUser } from "pamellov7-wrapper";
import { useAuthorizationState, useConnectionState, usePamello } from "pamellov7-wrapper/hooks";
import { useEffect, useState } from "react";

export default function Home() {
	const connected = useConnectionState();
	const authorized = useAuthorizationState();

	const [urlInputValue, setUrlInput] = useState("https://server.tpamello.marsoau.com");
	const [tokenInputValue, setTokenInput] = useState("9a40ad25-7e80-43c1-bdd9-a7a84218db5d");

	const pamello = usePamello();

	useEffect(() => {
		console.log("test");
		if (!authorized) return;
		console.log("done");

		const a = async () => {
			var result = await pamello.peql.getSingleAsync(RemoteUser, "me");
			if (!result) {
				console.log("no result");
				return
			}

			pamello.events.watch(() => {
				console.log("change");
			}, () => [result]);

			console.log(result);
		}

		a();
	}, [authorized]);

	const connect = () => {
		pamello.connectAsync(urlInputValue);
	}
	const disconnect = () => {
		pamello.disconnectAsync();
	}
	const authorize = () => {
		pamello.authorizeAsync(tokenInputValue);
	}
	const unauthorize = () => {
		pamello.unauthorizeAsync();
	}

	return <div>
		<div>
			<input
				type="text"
				value={urlInputValue}
				onChange={(e) => setUrlInput(e.target.value)}
				placeholder="Server Url"
			/>
			<button
				onClick={connect}
			>connect</button>
		</div>
		<div>
			<button
				onClick={disconnect}
			>disconnect</button>
		</div>
		<div>
			<input
				type="text"
				value={tokenInputValue}
				onChange={(e) => setTokenInput(e.target.value)}
				placeholder="User Token"
			/>
			<button
				onClick={authorize}
			>authorize</button>
		</div>
		<div>
			<button
				onClick={unauthorize}
			>unauthorize</button>
		</div>
		<div>{connected ? "Connected" : "DISconnected"}</div>
		<div>{authorized ? "Authorized" : "UNauthorized"}</div>
	</div>;
}

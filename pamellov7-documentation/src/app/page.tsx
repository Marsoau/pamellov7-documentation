"use client"

import { useConnectionState, useAuthorizationState, usePamello } from "pamellov7-wrapper/hooks";

export default function Home() {
	const connected = useConnectionState();
	const authorized = useAuthorizationState();

	const pamello = usePamello();

	const connect = () => {
		pamello.connectAsync("https://server.tpamello.marsoau.com");
	}
	const disconnect = () => {
		pamello.disconnectAsync();
	}
	const authorize = () => {
		pamello.authorizeAsync("9a40ad25-7e80-43c1-bdd9-a7a84218db5d");
	}
	const unauthorize = () => {
		pamello.unauthorizeAsync();
	}

	return <div>
		<div>
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

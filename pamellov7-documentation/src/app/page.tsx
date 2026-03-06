"use client"

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useAuthorizationState, useConnectionState, usePamello, usePlayer, useSong, useUser } from "pamellov7-wrapper/hooks";
import { useState } from "react";

export default function Home() {
	const connected = useConnectionState();
	const authorized = useAuthorizationState();

	const [urlInputValue, setUrlInput] = useState("https://server.tpamello.marsoau.com");
	const [tokenInputValue, setTokenInput] = useState("9a40ad25-7e80-43c1-bdd9-a7a84218db5d");

	const pamello = usePamello();

	const user = useUser("me");
	const player = usePlayer(user?.Dto.SelectedPlayerId ?? 0);
	const song = useSong(player?.Dto.Queue.CurrentSongId ?? 0);

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
		<div>{user?.Name ?? "NOUSER"}</div>
		<div>{player?.Dto.Name ?? "NOPLAYEr"}</div>
		<div>{song?.Dto.Name ?? "NOsong"}</div>
		{player && <div>
			{player.Dto.Queue.CurrentSongTimePassed} : {player.Dto.Queue.CurrentSongTimeTotal}
		</div>}
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

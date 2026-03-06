import { createContext, useContext, useEffect, useState } from "react";
import { PamelloClient } from "./PamelloClient";
import { ClassType } from "./Query/Base/IRemoteEntityQueryService";
import { IRemoteEntity } from "./Entities/Base/IRemoteEntity";
import { RemoteUser } from "./Entities/RemoteUser";
import { RemotePlayer } from "./Entities/RemotePlayer";
import { RemotePlaylist } from "./Entities/RemotePlaylist";
import { RemoteEpisode } from "./Entities/RemoteEpisode";
import { RemoteSong } from "./Entities/RemoteSong";

const PamelloContext = createContext<PamelloClient | null>(null);

export const PamelloProvider: React.FC<{ client: PamelloClient; children: React.ReactNode }> = ({ client, children }) => {
    useEffect(() => {
		const initialConnection = async () => {
			//todo check browser storage for connection data and connect
		}
		initialConnection();
        //client.events.Connect();
    }, []);

    return (
        <PamelloContext.Provider value={client}>
            {children}
        </PamelloContext.Provider>
    );
};

export function usePamello(): PamelloClient {
    const context = useContext(PamelloContext);
    if (!context) {
        throw new Error('usePamello must be used within a PamelloProvider');
    }
    return context;
};

export function useConnectionState(): boolean {
	var pamello = usePamello();
	var [state, setState] = useState(pamello.signal.isConnected);

	useEffect(() => {
		const onConnected = () => setState(true);
		const onDisconnected = () => setState(false);

		pamello.on("onConnected", onConnected);
		pamello.on("onDisconnected", onDisconnected);

		return () => {
			pamello.off("onConnected", onConnected)
			pamello.off("onDisconnected", onDisconnected)
		}
	}, [])

	return state;
}

export function useAuthorizationState(): boolean {
	var pamello = usePamello();
	var [state, setState] = useState(pamello.signal.isAuthorized);

	useEffect(() => {
		const onAuthorized = () => setState(true);
		const onUnauthorized = () => setState(false);

		pamello.on("onAuthrorized", onAuthorized);
		pamello.on("onUnauthrorized", onUnauthorized);

		return () => {
			pamello.off("onAuthrorized", onAuthorized)
			pamello.off("onUnauthrorized", onUnauthorized)
		}
	}, [])

	return state;
}

export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, id: number): TEntityType | null;
export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, query: string): TEntityType | null;
export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, queryOrId: string | number): TEntityType | null {
	const pamello = usePamello();
	const isAuthorized = useAuthorizationState();

	const fastEntity = typeof queryOrId === 'number' ? pamello.peql.getSingle(type, queryOrId) : null;

    const [entity, setEntity] = useState<TEntityType | null>(
		fastEntity
	);

	const [, setTick] = useState(0);
	const refresh = () => setTick(tick => tick + 1);

	useEffect(() => {
		if (!isAuthorized) {
			if (entity) setEntity(null);
			return
		}

		setEntity(fastEntity);
		if (fastEntity) return;

		const requestEntity = async () => {
			const result = await pamello.peql.getSingleAsync(type, queryOrId as any);
			if (!result) return;

			setEntity(result);
		};

		requestEntity();
	}, [isAuthorized, type, queryOrId])

	useEffect(() => {
		if (entity) {
			pamello.events.watch(() => {
				refresh();
			}, () => [entity])
		}
	}, [entity]);

	return entity;
}

export function useUser(queryOrId: string | number) {
	return useEntity(RemoteUser, queryOrId as any);
}

export function useSong(queryOrId: string | number) {
	return useEntity(RemoteSong, queryOrId as any);
}

export function useEpisode(queryOrId: string | number) {
	return useEntity(RemoteEpisode, queryOrId as any);
}

export function usePlaylist(queryOrId: string | number) {
	return useEntity(RemotePlaylist, queryOrId as any);
}

export function usePlayer(queryOrId: string | number) {
	return useEntity(RemotePlayer, queryOrId as any);
}


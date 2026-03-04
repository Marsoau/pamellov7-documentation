import { createContext, useContext, useEffect, useState } from "react";
import { PamelloClient } from "./PamelloClient";
import { ClassType } from "./Query/Base/IRemoteEntityQueryService";
import { IRemoteEntity } from "./Entities/Base/IRemoteEntity";
import { RemoteUser } from "./Entities/RemoteUser";

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

	pamello.on("onConnected", () => setState(true));
	pamello.on("onDisconnected", () => setState(false));

	return state;
}

export function useAuthorizationState(): boolean {
	var pamello = usePamello();
	var [state, setState] = useState(pamello.signal.isConnected);

	pamello.on("onAuthrorized", () => setState(true));
	pamello.on("onUnauthrorized", () => setState(false));

	return state;
}

export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, id: number): TEntityType | null;
export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, query: string): TEntityType | null;
export function useEntity<TEntityType extends IRemoteEntity>(type: ClassType<TEntityType>, queryOrId: string | number): TEntityType | null {
	console.log("HHOK CALL");
	const pamello = usePamello();
	const isAuthorized = useAuthorizationState();

	const fastEntity = typeof queryOrId === 'number' ? pamello.peql.getSingle(type, queryOrId) : null;

    const [entity, setEntity] = useState<TEntityType | null>(
		fastEntity
	);

	const [, setTick] = useState(0);
	const refresh = () => setTick(tick => tick + 1);

	useEffect(() => {
		console.log("1UE CALL");
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
		console.log("2UE CALL");
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


import { createContext, useContext, useEffect, useState } from "react";
import { PamelloClient } from "./PamelloClient";

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

export const usePamello = (): PamelloClient => {
    const context = useContext(PamelloContext);
    if (!context) {
        throw new Error('usePamello must be used within a PamelloProvider');
    }
    return context;
};

export const useConnectionState = (): boolean => {
	var pamello = usePamello();
	var [state, setState] = useState(pamello.signal.isConnected);

	pamello.on("onConnected", () => setState(true));
	pamello.on("onDisconnected", () => setState(false));

	return state;
}

export const useAuthorizationState = (): boolean => {
	var pamello = usePamello();
	var [state, setState] = useState(pamello.signal.isConnected);

	pamello.on("onAuthrorized", () => setState(true));
	pamello.on("onUnauthrorized", () => setState(false));

	return state;
}


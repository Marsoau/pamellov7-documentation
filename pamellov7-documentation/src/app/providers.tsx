"use client";

import React, { useMemo, useRef } from 'react';
import { pamelloClient, PamelloClient } from 'pamellov7-wrapper';
import { PamelloProvider } from 'pamellov7-wrapper/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
	const clientRef = useRef<PamelloClient | null>(null);

	if (!clientRef.current) {
		clientRef.current = new PamelloClient();
	}

	return (
		<PamelloProvider client={clientRef.current}>
			{children}
		</PamelloProvider>
	);
}

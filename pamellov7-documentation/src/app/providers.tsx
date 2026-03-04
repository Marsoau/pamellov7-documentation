"use client";

import React from 'react';
import { pamelloClient, PamelloClient } from 'pamellov7-wrapper';
import { PamelloProvider } from 'pamellov7-wrapper/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PamelloProvider client={pamelloClient}>
			{children}
		</PamelloProvider>
	);
}

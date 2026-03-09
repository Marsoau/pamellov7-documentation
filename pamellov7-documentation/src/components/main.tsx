"use client"

import { useState } from "react";
import Header from "./header";
import Slideout from "./slideout";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const [slideoutHeight, setSlideoutHeight] = useState(300);

	const [slideoutCollapsed, setSlideoutCollapsed] = useState(true);

	const path = usePathname();
	const slideoutExpanded = path == "/";

	return <div className="min-h-screen flex flex-col">
		<Header/>
		<main
			className="grow"
			style={{
				display: slideoutExpanded && !slideoutCollapsed ? "none" : "block"
			}}
		>
			{children}
		</main>
		<Slideout
			isExpanded={slideoutExpanded}
			isCollapsed={slideoutCollapsed}
			setCollapsed={setSlideoutCollapsed}
			height={slideoutHeight}
			setHeight={setSlideoutHeight}
		/>
	</div>
}

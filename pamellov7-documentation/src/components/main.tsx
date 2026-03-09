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

	return (
		<div className="min-h-screen flex flex-col overflow-hidden">
			<Header />

			<div
				className={`overflow-hidden min-h-0 transition-all duration-300 ease-in-out relative ${
slideoutExpanded && !slideoutCollapsed
? "opacity-0 flex-[0_0_0px]"
: "opacity-100 flex-1"
}`}
			>
				<main className="h-full relative">
					<div 
						key={path} 
						className="absolute inset-x-0 top-0 animate-in fade-in duration-300 fill-mode-backwards"
					>
						{children}
					</div>
				</main>
			</div>

			<Slideout
				isExpanded={slideoutExpanded}
				isCollapsed={slideoutCollapsed}
				setCollapsed={setSlideoutCollapsed}
				height={slideoutHeight}
				setHeight={setSlideoutHeight}
			/>
		</div>
	)
}

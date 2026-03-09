"use client"

import { useState } from "react";
import Header from "./header";
import Slideout from "./slideout";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {

	const [slideoutCollapsed, setSlideoutCollapsed] = useState(true);

	const path = usePathname();
	const slideoutExpanded = path == "/";

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<div
				className={`transition-all duration-300 ease-in-out grid ${
					slideoutExpanded && !slideoutCollapsed
						? "grid-rows-[0fr] opacity-0"
						: "grid-rows-[1fr] opacity-100 flex-1"
				}`}
			>
				<main className="overflow-hidden min-h-0">
					<div 
						key={path} 
						className="animate-in fade-in duration-300 fill-mode-backwards"
					>
						{children}
					</div>
				</main>
			</div>

			<Slideout
				isExpanded={slideoutExpanded}
				isCollapsed={slideoutCollapsed}
				setCollapsed={setSlideoutCollapsed}
			/>
		</div>
	)
}

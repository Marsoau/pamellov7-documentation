"use client"

import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./button";
import { usePathname } from "next/navigation";

export default function HeaderButton({ href, children }: {
	href: string,
	children: ReactNode
}) {
	const path = usePathname();

	const isHighlited = path.startsWith(href);

	return <Link href={isHighlited ? "/" : href}>
		<Button variant={isHighlited ? "highlited" : "default"} onClick={() => console.log(`click on ${href}`)}>
			{children}
		</Button>
	</Link>
}

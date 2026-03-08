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

	const index = path.indexOf("/", 1);

	console.log("aaa");
	console.log(path.substring(0, index != -1 ? index : path.length));
	console.log("bnbb");
	console.log(href);

	const isHighlited = path.substring(0, index != -1 ? index : path.length) == href;

	return <Link href={isHighlited ? "/" : href}>
		<Button variant={isHighlited ? "highlited" : "transparent"} onClick={() => console.log(`click on ${href}`)}>
			{children}
		</Button>
	</Link>
}

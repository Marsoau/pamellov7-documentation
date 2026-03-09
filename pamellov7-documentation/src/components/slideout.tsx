import { Dispatch, SetStateAction } from "react"
import { Button } from "./ui/button"

export default function Slideout({
	isExpanded,
	isCollapsed,
	setCollapsed,
	height,
	setHeight
}: {
	isExpanded: boolean,
	isCollapsed: boolean,
	setCollapsed: Dispatch<SetStateAction<boolean>>
	height: number,
	setHeight: Dispatch<SetStateAction<number>>
}) {
	return <div
		className="sticky bottom-0 flex flex-col"
		style={{
			flexGrow: isExpanded && !isCollapsed ? 1 : 0
		}}
	>
		<div
			className="bg-back-3 h-10"
			onClick={() => setCollapsed(!isCollapsed)}
		>
			<span>{isExpanded ? "y" : "n"}</span>
			<span>{isCollapsed ? "y" : "n"}</span>
			<span>{height}</span>
		</div>
		<div
			className="grow bg-back-1"
			style={{
				display: isCollapsed ? "none" : "block",
				minHeight: isCollapsed ? 0 : height
			}}
		>
		</div>
	</div>
}

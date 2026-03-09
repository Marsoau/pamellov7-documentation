import { Dispatch, SetStateAction } from "react"

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
		className="sticky bottom-0 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
		style={{
			display: "grid",
			flexBasis: isCollapsed ? 40 : height + 40,
			flexGrow: isExpanded && !isCollapsed ? 1 : 0,
			flexShrink: 0,
			gridTemplateRows: isCollapsed ? "40px 0px" : `40px minmax(0, 1fr)`,
		}}
	>
		<div
			className="bg-back-3 h-full cursor-pointer flex items-center gap-4 px-4"
			onClick={() => setCollapsed(!isCollapsed)}
		>
			<span>Exp: {isExpanded ? "y" : "n"}</span>
			<span>Col: {isCollapsed ? "y" : "n"}</span>
			<span>{height}</span>
		</div>
		<div
			className="bg-back-1 overflow-hidden min-h-0"
			style={{
				minHeight: height
			}}
		>
			<div className="flex flex-col flex-wrap h-full">
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
				<div>content</div>
			</div>
		</div>
	</div>
}

import Page from "@/app/(docs)/[...slug]/page";
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function Slideout({
	isExpanded,
	isCollapsed,
	setCollapsed,
}: {
	isExpanded: boolean,
	isCollapsed: boolean,
	setCollapsed: Dispatch<SetStateAction<boolean>>
}) {
	const [height, setHeight] = useState(300);

	const [dragPosition, setDragPosition] = useState(-1);

	useEffect(() => {
		const onpointermove = (e: PointerEvent) => {
			if (dragPosition < 0) return;
			if (isExpanded || isCollapsed) return;

			setHeight(height - e.movementY);
		}
		const onpointerup = (e: PointerEvent) => {
			if (dragPosition < 0) return;
			console.log("up at");
			console.log(e.screenY);

			if (dragPosition == e.screenY) {
				setCollapsed(!isCollapsed);
			}

			setDragPosition(-1);
		}

		window.addEventListener("pointermove", onpointermove);
		window.addEventListener("pointerup", onpointerup);

		return () => {
			window.removeEventListener("pointermove", onpointermove)
			window.removeEventListener("pointerup", onpointerup);
		}
	}, [height, dragPosition])

	return <div
		className={`sticky bottom-0 flex flex-col  overflow-hidden ${dragPosition < 0 ? "transition-all duration-300 ease-in-out" : ""}`}
		style={{
			display: "grid",
			flexBasis: isCollapsed ? 40 : height + 40,
			flexGrow: isExpanded && !isCollapsed ? 1 : 0,
			flexShrink: 0,
			gridTemplateRows: isCollapsed ? "40px 0px" : `40px minmax(0, 1fr)`,
		}}
	>
		<div
			className="bg-back-3 h-full cursor-pointer flex items-center gap-4 px-4 select-none"
			onMouseDown={(e) => {
				console.log("setting");
				console.log(e.screenY);
				setDragPosition(e.screenY);
			}}
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

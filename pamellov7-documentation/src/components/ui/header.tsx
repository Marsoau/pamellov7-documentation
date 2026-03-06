import { Button } from "./button";
import HeaderButton from "./headerButton";

export default function Header() {
	return <header
		className="flex items-center px-2 gap-2.5 bg-back-3 h-10"
	>
		<HeaderButton href="/Guides">Guides</HeaderButton>
		<HeaderButton href="/PEQL">PEQL</HeaderButton>
		<HeaderButton href="/API">API</HeaderButton>
		<HeaderButton href="/Commands">Commands</HeaderButton>
		<HeaderButton href="/Types">Types</HeaderButton>
	</header>
}

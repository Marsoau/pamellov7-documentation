import HeaderButton from "./headerButton";

export default function Header() {
	return <header
		className="flex items-center px-2 gap-2.5 bg-back-3 h-10"
	>
		<HeaderButton href="/guides">Guides</HeaderButton>
		<HeaderButton href="/peql">PEQL</HeaderButton>
		<HeaderButton href="/api">API</HeaderButton>
		<HeaderButton href="/commands">Commands</HeaderButton>
		<HeaderButton href="/types">Types</HeaderButton>
	</header>
}

export default function TabsLayout({
	children,
}: Readonly<{
		children: React.ReactNode;
	}>) {
	return <div className="grow">
		<aside>
			asd
		</aside>
		<div>
			{children}
		</div>
	</div>
}

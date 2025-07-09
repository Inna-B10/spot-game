import Link from 'next/link'

export default function Home() {
	return (
		<div>
			<h1>Home page</h1>
			<ul>
				<li>
					<Link href='/game/image1_1'>Game</Link>
				</li>
				<li>
					<Link href='/editor'>Editor</Link>
				</li>
			</ul>
		</div>
	)
}

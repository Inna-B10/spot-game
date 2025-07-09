import Link from 'next/link'

export default function Home() {
	return (
		<div>
			<h1>Home page</h1>
			<ul>
				<li>
					<Link href='/differences/image1_1'>Найди отличия</Link>
				</li>
				<li>
					<Link href='/editor'>Editor: differences</Link>
				</li>
			</ul>
		</div>
	)
}

export default function NotFoundPage(page = true, text = 'Page') {
	return (
		<div className='w-full h-screen flex flex-col mx-auto'>
			<div className='mx-auto w-1/2 mt-24 text-center'>
				<h1 className='font-bold text-6xl mb-5'>404</h1>
				<p className='text-xl'>{text} not found!</p>
			</div>
		</div>
	)
}

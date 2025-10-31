import { LinkButton } from '@/components/ui/buttons/LinkButton'

export default function NotFoundPage(page = true, text = 'Page') {
	return (
		<div className='w-full h-screen flex flex-col mx-auto'>
			<div className='mx-auto w-1/2 mt-24 text-center space-y-8'>
				<h1 className='font-bold text-6xl mb-5'>404</h1>
				<p className='text-xl'>{text} not found!</p>
				<div className='flex gap-4 justify-center items-center'>
					<LinkButton href='/'>Back to Home</LinkButton>
					<LinkButton href='/editor'>Back to Editor</LinkButton> //[TODO] Hide from unauthorized users
				</div>
			</div>
		</div>
	)
}

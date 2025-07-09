'use client'

import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function DifferenceEditor() {
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [imageName, setImageName] = useState('image1')
	const [differences, setDifferences] = useState([])
	const [radius, setRadius] = useState(25)
	const imageRef = useRef(null)

	function handleImageUpload(e) {
		const file = e.target.files[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setDifferences([])
		}
	}

	function handleClick(event) {
		if (!imageRef.current) return

		const rect = imageRef.current.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		let removed = false

		const updated = differences.filter(diff => {
			const dx = x - diff.x
			const dy = y - diff.y
			const distance = Math.sqrt(dx * dx + dy * dy)
			if (distance < diff.radius) {
				removed = true
				return false
			}
			return true
		})

		if (removed) {
			setDifferences(updated)
		} else {
			const newDiff = {
				id: uuid(),
				x: Math.round(x),
				y: Math.round(y),
				radius: Number(radius),
			}
			setDifferences(prev => [...prev, newDiff])
		}
	}

	async function handleSave() {
		if (!imageFile || differences.length === 0 || !imageName) {
			alert('Fill in all fields and upload the image')
			return
		}

		const formData = new FormData()
		formData.append('file', imageFile)
		formData.append('name', imageName)
		formData.append('differences', JSON.stringify(differences))

		const res = await fetch('/api/save-level', {
			method: 'POST',
			body: formData,
		})

		const data = await res.json()
		if (res.ok) {
			alert(`Level saves! File: ${data.file}`)
		} else {
			alert('Error: ' + data.error)
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<label className='block mb-2 font-medium'>UUpload image:</label>
				<input type='file' accept='image/*' onChange={handleImageUpload} />
			</div>

			{imageUrl && (
				<div className='relative inline-block' onClick={handleClick}>
					<img
						ref={imageRef}
						src={imageUrl}
						alt='Uploaded'
						className='max-w-full border'
					/>
					{differences.map((diff, index) => (
						<div
							key={diff.id}
							className='absolute border-2 border-red-500 rounded-full pointer-events-none'
							style={{
								left: diff.x - diff.radius,
								top: diff.y - diff.radius,
								width: diff.radius * 2,
								height: diff.radius * 2,
							}}
						/>
					))}
				</div>
			)}

			{imageUrl && (
				<div className='space-y-4'>
					<div className='flex flex-wrap gap-4 items-center'>
						<label>
							Radius:
							<input
								type='number'
								value={radius}
								onChange={e => setRadius(e.target.value)}
								className='ml-2 border p-1 w-16'
							/>
						</label>

						<label>
							Image name:
							<input
								type='text'
								value={imageName}
								onChange={e => setImageName(e.target.value)}
								placeholder='f.ex: image1'
								className='ml-2 border p-1 w-40'
							/>
						</label>

						<button
							onClick={handleSave}
							className='px-4 py-2 bg-green-600 text-white rounded'>
							Save level
						</button>
					</div>

					<pre className='bg-gray-100 p-4 text-sm max-h-64 overflow-auto'>
						{JSON.stringify(differences, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}

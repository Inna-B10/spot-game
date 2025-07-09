export async function handleSave() {
	if (!file || !levelId || differences.length === 0 || !imageName) {
		alert('Заполните все поля и загрузите картинку')
		return
	}

	const formData = new FormData()
	formData.append('file', file)
	formData.append('id', levelId)
	formData.append('name', imageName)
	formData.append('differences', JSON.stringify(differences))

	const res = await fetch('/api/save-level', {
		method: 'POST',
		body: formData,
	})

	const data = await res.json()
	if (res.ok) {
		alert(`Уровень сохранён! Файл: ${data.file}`)
		// optionally reset state
	} else {
		alert('Ошибка: ' + data.error)
	}
}

const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('email', 'john@example.com')
formData.append('avatar', new File(['test'], 'avatar.jpg', { type: 'image/jpeg' }))
fetch('https://example.com/api/v1/users', {
  method: 'POST',
  body: formData,
})

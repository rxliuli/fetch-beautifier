fetch('https://api.example.com/data?userId=123&type=post&limit=10&offset=0', {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  },
  body: '{"title":"Hello World","content":"This is a test"}',
  method: 'POST',
})
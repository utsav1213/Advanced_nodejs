const http = require('http')

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("helo world\n")
})
server.listen(3000, () => {
    console.log('server is running in the port 3000')
})

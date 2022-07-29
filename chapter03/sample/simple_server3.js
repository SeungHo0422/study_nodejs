const http = require('http');

http.createServer((req, res) => {
    if (req.url === '/') {
        res.write("Hello");
        res.end();
    }
})
    .listen(8080, () => {
        console.log("8080port connecting...");
    })
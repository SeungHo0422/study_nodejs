const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.send("Hello World! I'm Seungho Song");
});

app.listen(8080, () => console.log('8080 포트에서 서버 실행중 updating...'));

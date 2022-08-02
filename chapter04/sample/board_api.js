const morgan = require('morgan');

/* express app generate */
const express = require('express');
const app = express();

/* port setting */
app.set('port', process.env.PORT || 8080);

/* common middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* board data for test */
let boardList = [];
let numOfBoard = 0;

/* Routing setting */
app.get('/', (req, res) => {
    res.send('This is api.js');
});

/* Board API */
app.get('/board', (req, res) => {
    res.send(boardList);
});

app.post('/board', (req, res) => {
    const board = {
        "id": ++numOfBoard,
        "user_id": req.body.user_id,
        "date": new Date(),
        "title": req.body.title,
        "content": req.body.content
    };
    boardList.push(board);

    res.redirect('/board');
});

app.put('/board/:id', (req, res) => {
    // req.params.id 갑 찾아 리스트에서 삭제
    const findItem = boardList.find((item) => {
        return item.id == +req.params.id
    });

    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    // 리스트에 새로운 요소 추가
    const board = {
        "id": +req.params.id,
        "user_id": req.params.user_id,
        "date": new Date(),
        "title": req.body.title,
        "content": req.body.content
    };
    boardList.push(board);
    res.redirect('/board');
});

app.delete('/board/:id', (req, res) => {
    const findItem = boardList.find((item) => {
        return item.id == +req.params.id
    });

    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    res.redirect('/board');
});

/* Connecting Server-Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), "번 포트에서 서버 실행 중...");
});
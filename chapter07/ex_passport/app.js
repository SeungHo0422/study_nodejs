const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;

const app = express();

/* port Setting */
app.set('port', process.env.PORT || 8080);

/* Virtual Data */
let fakeUser = {
    username: 'songseungho9258@gmail.com',
    password: 'ricky9258!'
}

/* Common Middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('passportExample'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'passportExample',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

/* passport Middleware */
app.use(passport.initialize()); //passport 초기화
app.use(passport.session()); //passport session 연동

/* 세션 처리 - 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장 */
passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

/* 세션 처리 - 로그인 후 페이지 방문마다 사용자의 실제 데이터 주입 */
passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    done(null, fakeUser); //req.user에 전달
});

passport.use(new Localstrategy(
    function (username, password, done) {
        if (username === fakeUser.username) {
            if (password === fakeUser.password) {
                return done(null, fakeUser);
            } else {
                return done(null, false, { message: "password incorrect" });
            }
        } else {
            return done(null, false, { message: "username incorrect" });
        }
    }
));

/* Routing Setting */
app.get('/', (req, res) => {
    if (!req.user) { //not login
        res.sendFile(__dirname + "/index.html");
    } else { //login
        const user = req.user.username;
        const html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>${user}님 안녕하세요!</p>
            <button type="button" onclick="location.href='/logout'">Log Out</button>
        </body>
        </html>
        `
        res.send(html);
    }
});

/* passport Login : strategy-Local */
/* Authenticate Requests */
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function (req, res) {
        res.send('Login Success..!')
    });

app.get('/logout', function (req, res) {
    console.log("logout start");
    req.session.destroy(function (err) {
        res.redirect('/');
    });
    console.log("logout fin");
});

/* 404 Error Handling */
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
    error.status = 404;
    next(error);
});

/* Error Handling Middleware */
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error Occurred');
});

/* Connecting Server-Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});


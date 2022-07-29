const morgan = require('morgan');
const request = require('request');
const express = require('express');
const app = express();

/* Port setting */
app.set('port', process.env.PORT || 8080);

/* Common Middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routing Setting */
app.get('/naver/news', (req, res) => {
    const client_id = 'WWAvFqodWpSIYUhYrzqq';
    const client_secret = 'zD0zd3eFri';
    const api_url = 'https://openapi.naver.com/v1/search/news?query='
                    + encodeURI('삼성'); //encodeURI(req.query.query);
    const option = {

    };
    const options = {
        url: api_url,
        qs: option,
        headers: { 'X-Naver-Client-Id': client_id,
                    'X-Naver-Client-Secret': client_secret },
    };

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let newsItem = JSON.parse(body).items;
            // items - title, link, description, pubDate

            const newsJson = {
                title: [],
                link: [],
                description: [],
                pubDate: []
            }

            for (let i = 0; i < newsItem.length; i++) {
                newsJson.title.push(newsItem[i].title.replace
                    (/(<([^>]+)>)|&quot;/ig, ""));
                newsJson.link.push(newsItem[i].link);
                newsJson.description.push(newsItem[i].description.replace
                    (/(<([^>]+)>)|&quot;/ig, ""));
                newsJson.pubDate.push(newsItem[i].pubDate);
            }
            res.json(newsJson);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

/* Connecting Server-Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const morgan = require('morgan');
const axios = require('axios');

/* express app generate */
const express = require('express');
const app = express();

/* redis connect */
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
client.on('error', (err) => {
    console.log('Redis Error : ' + err);
});

/* port setting */
app.set('port', process.env.PORT);

/* common middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routing setting */
app.get('/airkorea', async (req, res) => {
    await client.lrange('airItems', 0, -1, async (err, cachedItems) => {
        if (err) throw err;
        if (cachedItems.length) {
            console.log(cachedItems[0]);
            res.send(`데이터가 캐시에 있습니다. <br>
                    관측 지역 : ${cachedItems[0]} / 관측 시간 : ${cachedItems[1]} <br>
                    미세먼지 : ${cachedItems[2]}, 초미세먼지 : ${cachedItems[3]} 입니다.`);
        } else {
            const serviceKey = process.env.airServiceKey;
            const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

            let parmas = encodeURI('serviceKey') + "=" + serviceKey;
            parmas += "&" + encodeURI('numOfRows') + "=" + encodeURI('1');
            parmas += "&" + encodeURI('pageNo') + "=" + encodeURI('1');
            parmas += "&" + encodeURI('dataTerm') + "=" + encodeURI('DAILY');
            parmas += "&" + encodeURI('ver') + "=" + encodeURI('1.3');
            parmas += "&" + encodeURI('stationName') + "=" + encodeURI('영등포구');
            parmas += "&" + encodeURI('returnType') + "=" + encodeURI('json');

            const url = airUrl + parmas;

            try {
                const result = await axios.get(url);
                const airItem = {
                    "location": "영등포구",
                    "time": result.data.response.body.items[0]['dataTime'],
                    "pm10": result.data.response.body.items[0]['pm10Value'],
                    "pm25": result.data.response.body.items[0]['pm25Value'],
                }
                console.log(airItem["location"], airItem["time"], airItem["pm10"], airItem["pm25"]);
                const badAir = [];

                if (airItem.pm10 <= 30) { badAir.push("좋음😆😆"); }
                else if (airItem.pm10 > 30 && airItem.pm10 <= 80) { badAir.push("보통🤨🤨"); }
                else { badAir.push("나쁨🤬🤬"); }

                if (airItem.pm25 <= 15) { badAir.push("좋음😆😆"); }
                else if (airItem.pm25 > 15 && airItem.pm25 <= 35) { badAir.push("보통🤨🤨"); }
                else { badAir.push("나쁨🤬🤬"); }

                const airItems = [airItem.location, airItem.time, badAir[0], badAir[1]];
                airItems.forEach((val) => {
                    client.rpush('airItems', val);
                });
                client.expire('airItems', 60 * 60);

                res.send('캐시된 데이터가 없습니다.');
            } catch (error) {
                console.log(error);
            }
        }
    })
});

/* Connecting Server-Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중...')
});
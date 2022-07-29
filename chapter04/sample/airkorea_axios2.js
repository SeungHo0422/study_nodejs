const morgan = require('morgan');
const axios = require('axios');
const express = require('express');
const app = express();

/* port setting */
app.set('port', process.env.PORT || 8080);

/* Common Middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

/* Routing setting */
app.get('/airkorea/detail', async (req, res) => {
    const serviceKey = "mhsnuOzyvvPNOR%2FmtpX9TWbIJPRmtnnHkpo5nbBZ%2FaFMcOg2ulMvtuRco4LWKQytrDiLbmK2Yudy16LsjKqU4Q%3D%3D";
    const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

    let parmas = encodeURI('serviceKey') + '=' + serviceKey;
    parmas += '&' + encodeURI('numOfRows') + '=' + encodeURI('1');
    parmas += '&' + encodeURI('pageNo') + '=' + encodeURI('1');
    parmas += '&' + encodeURI('dataTerm') + '=' + encodeURI('DAILY');
    parmas += '&' + encodeURI('ver') + '=' + encodeURI('1.0');
    parmas += '&' + encodeURI('stationName') + '=' + encodeURI('마포구');
    parmas += '&' + encodeURI('returnType') + '=' + encodeURI('json');

    const url = airUrl + parmas;

    try {
        const result = await axios.get(url);
        const airItem = {
            "location": "마포구",
            "time": result.response.items[0]['dataTime'],
            "pm10": result.data.items[0]['pm10Value'],
            "pm25": result.data.items[0]['pm25Value']
        }
        const badAir = [];

        if (airItem.pm10 <= 30) {
            badAir.push("Good!!");
        } else if (pm10 > 30 && pm10 <= 80) {
            badAir.push("So So...");
        } else {
            badAir.push("Bad..");
        }

        if (airItem.pm25 <= 15) {
            badAir.push("Good!!");
        } else if (pm25 > 15 && pm25 <= 35) {
            badAir.push("So So...");
        } else {
            badAir.push("Bad...");
        }

        res.send('관측 지역: ${airItem.location} / 관측 시간 : ${airItem.time} <br> 미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]} 입니다.');
    } catch (error) {
        console.log(error);
    }
});

/* Connecting Server-Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});
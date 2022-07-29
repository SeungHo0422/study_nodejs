const morgan = require('morgan');
const axios = require('axios');
const express = require('express');
const app = express();

/* port setting */
app.set('port', process.env.PORT || 8080);

/* common Middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* Routing Setting */
app.get('/airkorea', async (req, res) => {
    const serviceKey = "mhsnuOzyvvPNOR/mtpX9TWbIJPRmtnnHkpo5nbBZ/aFMcOg2ulMvtuRco4LWKQytrDiLbmK2Yudy16LsjKqU4Q=="
    const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

    let parmas = encodeURI('serviceKey') + '=' + serviceKey;
    parmas += '&' + encodeURI('numOfRows') + '=' + encodeURI('1');
    parmas += '&' + encodeURI('pageNo') + '=' + encodeURI('1');
    parmas += '&' + encodeURI('dataTerm') + '=' + encodeURI('DAILY');
    parmas += '&' + encodeURI('ver') + '=' + encodeURI('1.3');
    parmas += '&' + encodeURI('stationName') + '=' + encodeURI('영등포구');
    parmas += '&' + encodeURI('returnType') + '=' + encodeURI('json');
    

    const url = airUrl + parmas;

    try {
        const result = await axios.get(url);
        res.json(result.data); //.data
    } catch (error) {
        console.log(error);
    }
});

/* Connecting Server - Port */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});
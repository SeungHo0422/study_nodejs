/* A.js */

console.log('a.js 진입...!');

const b = require('./B');

module.exports = {
    call: () => {
        console.log('a.js에서 b 호출 : ', b);
    }
};
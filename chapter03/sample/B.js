/* B.js */

console.log('b.js 진입...!');

const a = require('./A');

module.exports = {
    call: () => {
        console.log('b.js에서 a 호출 : ', a);
    }
};
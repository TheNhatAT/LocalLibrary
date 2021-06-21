let express = require('express');
let app = express();

// //-- this is a middleware function
// let logger = function (req, res, next) {
//     console.log('Logged');
//     next();
// }
//
// app.use(logger);
//
//             //-- this is a middleware function
// app.get('/', function (req, res) {
//     res.send('Hello World!')
// })

// let requestTime = function (req, res, next) {
//     req.requestTime = Date.now();
//     next(); // call the next middleware function (fn in app.get(..))
// }
//
// app.use(requestTime);
// console.log(typeof app);
//
// app.get('/', ((req, res) => {
//     let responseText = 'Hello Nhat<br>';
//     responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//     res.send(responseText);
// }))
//

app.listen(3000)
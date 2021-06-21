let express = require('express');
let app = express();
let router = express.Router();

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

/** Application-level middleware */

//-- without path
// app.use(function (req, res, next) {
//     console.log('This middleware function run before any request');
//     next();
// })
//
// //-- with specified path
// app.use('/user/:id', function (req, res, next) {
//     console.log('This middleware function run before user/' + req.params.id);
//     next();
// })
//
// app.get('/user/:id', (req, res, next) => {
//     res.send('Hello');
// })

//-- To skip rest of next function - use next('route')
// app.get('/user/:id', function (req, res, next) {
//     // if the user ID is 0, skip to the next route
//     if (req.params.id === '0') next('route')
//     // otherwise pass the control to the next middleware function in this stack
//     else next()
// }, function (req, res, next) {
//     // send a regular response
//     res.send('regular')
// })

//-- array of middleware functions
// function logOriginalUrl (req, res, next) {
//     console.log('Request URL:', req.originalUrl)
//     next()
// }
//
// function logMethod (req, res, next) {
//     console.log('Request Type:', req.method)
//     next()
// }
//
// let  logStuff = [logOriginalUrl, logMethod];
//
// app.get('/user/:id', logStuff, function (req, res, next) {
//     res.send('User Info')
// })

/** Router-level middleware
 * Just like application-level
 * Used with router object
 *  */

/** Error-handling middleware
 * Must have 4 parameter (err, req, res, next)
 */

/** Built-in middleware
 * express.static serves static assets such as HTML files, images, and so on.
 * express.json parses incoming requests with JSON payloads
 * express.urlencoded parses incoming requests with URL-encoded payloads
 */

/** Third-party middleware
 * https://expressjs.com/en/resources/middleware.html
 */
app.listen(3000)
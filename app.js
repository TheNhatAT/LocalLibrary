let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let catalogRouter = require('./routes/catalog');
let compression = require('compression');
let helmet = require('helmet');

let app = express();

//Set up mongoose connection
let mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://1234:1234@cluster0.eedfk.mongodb.net/local_library?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB, { useNewUrlParser: true ,  useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
/** set the folder where templates is stored */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/** add middleware libraries into the req handling chain */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

/** thêm prefix vào URL trong các file route */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// can't route any path => catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = createError(404);
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (!err.status) err.status = 500;
    res.render('error', {error: err});
});

module.exports = app;



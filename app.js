var  createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://1234:1234@cluster0.eedfk.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
/** set the folder where templates is stored */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/** add middleware libraries into the req handling chain */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log('middleware');
    next();
})

/** thêm prefix vào URL trong các file route */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
module.exports = app;

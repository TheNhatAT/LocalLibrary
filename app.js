let  createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let catalogRouter = require('./routes/catalog');

let app = express();

//Set up mongoose connection
let mongoose = require('mongoose');
let mongoDB = 'mongodb+srv://1234:1234@cluster0.eedfk.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB, { useNewUrlParser: true ,  useUnifiedTopology: true});
let db = mongoose.connection;
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

/** thêm prefix vào URL trong các file route */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
module.exports = app;



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/*GO*/
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();
/*GO*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
/*GO*/
const pageRouter = require('./routes/page');
const{sequelize} = require('./models');
const passportConfig = require('./passport');
/*GO*/

var app = express();
/*GO*/
passportConfig();
/*GO*/

// view engine setup
/*GO*/
app.set('port',process.env.PORT || 8001);
/*GO*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //html로 수정함

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*GO*/
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret:
}))





app.use('/', indexRouter);
app.use('/users', usersRouter);







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

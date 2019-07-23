const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('./http/request');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const userInfoRouter = require('./routes/userInfo');
const amusement = require('./routes/amusement');
const assets = require('./routes/assets');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/zheng/public', express.static('public'));

app.use('/', indexRouter);
app.use('/zheng/user', userRouter);
app.use('/zheng/userInfo', userInfoRouter);
app.use('/zheng/amusement', amusement);
app.use('/zheng/assets', assets);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

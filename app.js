const createError = require('http-errors');
const cookieSession = require('cookie-session');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const usersZheng = require('./routes/zheng');
const status = require('./routes/status');
const amusement = require('./routes/amusement');
const json = require('./routes/json');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 注册session
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// app.use((req,res,next) => {
//   let uname = req.session.name;
//   if (uname) {
//    next();
//   }else{
//     let url = req.url;
//     if (url === '/users/login') {
//       next();
//     }else{
//       res.send('<script>alert("请登录")</script>');
//     }
//   }
// })
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/zheng', usersZheng);
app.use('/status', status);
app.use('/amusement', amusement);
app.use('/json', json);

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

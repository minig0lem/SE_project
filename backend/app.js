const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const config = require(__dirname + '/./config/config.json')['development'];

const option = {
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  expiration: 1000 * 60 * 60,               //1hour
  clearExpired: true,
  checkExpirationInterval: 1000 * 60 * 60
}

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const studentRouter = require('./routes/student');
const professorRouter = require('./routes/professor');

const app = express();
db.sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(option),
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/student', studentRouter);
app.use('/api/professor', professorRouter);

//라우팅 경로 외 모든 get 요청은 vue 파일 로드
app.get('*', (req, res, next) => {
    res.sendfile(path.join(__dirname, './public', 'index.html'));
});

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

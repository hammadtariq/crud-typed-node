import * as express from 'express';
import * as session from 'express-session';
import * as csrf from 'csurf';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
const passport = require('passport')
const router = express.Router();

// const csrf = require('csurf');
const path = require('path');
const favicon = require('serve-favicon');

import { router as index } from './routes/index';
import user from './routes/user.route';

const app = express();

app.use(session({
  secret: 'My super session secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true
  }
}));

app.use(csrf());

app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


// Bootstrap passport config
require('../config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', user(router, passport));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err['status'] = 404;
  next(err);
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

export default app;

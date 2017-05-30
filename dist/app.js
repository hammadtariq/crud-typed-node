"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const csrf = require("csurf");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const csrf = require('csurf');
const path = require('path');
const favicon = require('serve-favicon');
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
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
app.use('/', index_1.router);
app.use('/users', users_1.router);
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
exports.default = app;
//# sourceMappingURL=app.js.map
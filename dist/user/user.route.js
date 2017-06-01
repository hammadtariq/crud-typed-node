"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('./user.controller');
exports.default = (app, passport) => {
    /**Declare all routes file */
    app.post('/login', passport.authenticate('local', {}), User.login);
    app.post('/create', User.create);
    app.get('/logout', User.logout);
};
//# sourceMappingURL=user.route.js.map
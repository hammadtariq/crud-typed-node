"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const User = new user_controller_1.default();
function user(router, passport) {
    router.post('/login', passport.authenticate('local', {}), User.login);
    router.post('/create', User.create);
    router.get('/logout', User.logout);
    return router;
}
exports.default = user;
;
//# sourceMappingURL=user.route.js.map
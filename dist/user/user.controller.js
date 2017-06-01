"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const User = require('./user.model').User;
const Boom = require('boom');
class UserController {
    constructor() {
    }
    /**
   * Create user
   */
    create(req, res) {
        User.create(req.body, (err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.json({ data: "email already exist" });
                }
                return res.send(Boom.badImplementation(err));
            }
            return res.json(result);
        });
    }
    /**
     * Show login form
     */
    login(req, res) {
        if (req.user == "Unknown user") {
            return res.json({ status: "Not Exist" });
        }
        else if (req.user == "Invalid password") {
            return res.json({ status: "Invalid Username and Password" });
        }
        else {
            return res.json(req.user);
        }
    }
    /**
     * Logout
     */
    logout(req, res) {
        req.logout();
        return res.json(req.user);
    }
    /** authentication check. */
    authCallback(req, res) {
        return res.json(req.user);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map
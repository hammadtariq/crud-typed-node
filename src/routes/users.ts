import * as express from 'express';
import db from '../db';
import UserController from '../controllers/user.controller';
const User = new UserController();

export default (router, passport) => {
  /**Declare all routes file */
  router.post('/login',
    passport.authenticate('local', {
    }), User.login);
  router.post('/create', User.create);
  router.get('/logout', User.logout);

  return router;
};

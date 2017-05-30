import * as express from 'express';
var router = express.Router();
import db from '../db';

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.send('respond with a resource');
});

export { router };

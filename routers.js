const Router = require('express');
const router = new Router();
const Controller = require('./controller');
const { check } = require('express-validator');

const constructor = Controller.prototype.constructor;
const controller = new constructor();

router.post(
  '/registration',
  [
    check('username', 'Username cannot be empty.').notEmpty(),
    check('password', 'Password should not be shorter than 8 symbols.').isLength({ min: 8 }),
  ],
  controller.registration
);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;

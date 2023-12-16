const { json } = require('express');
const User = require('./user');
const Role = require('./roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../public/config');
const { validationResult } = require('express-validator');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class Сontroller {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Registration error`, errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: `User with such name already exists` });
      }
      const hashPassword = bcrypt.hashSync(password, 8);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();
      res.redirect('signup_successful.html');
      //return res.json({ message: `User was successfully created!` });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Registration error` });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User with such name does not exist` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Invalid password` });
      }
      const token = generateAccessToken(user._id, user.roles);
      res.redirect('login_successful.html');
      //return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Login error` });
    }
  }

  async getUsers(req, res) {
    try {
      res.json('server works');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Сontroller;

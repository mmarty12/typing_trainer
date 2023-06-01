const { json } = require('express');
const User = require('./user');
const Role = require('./roles');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class Сontroller {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Error during resgistration`, errors });
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
      return res.json({ message: `User was successfully created!` });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Registration error` });
    }
  }
  async login(req, res) {
    try {
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

module.exports = new Сontroller();

const { json } = require('express');
const User = require('./user');
const Role = require('./roles');

class Сontroller {
  async registration(req, res) {
    try {
    } catch (e) {}
  }
  async login(req, res) {
    try {
    } catch (e) {}
  }
  async getUsers(req, res) {
    try {
      const userRole = new Role();
      const adminRole = new Role({ value: 'ADMIN' });
      await userRole.save();
      await adminRole.save();
      res.json('server works');
    } catch (e) {}
  }
}

module.exports = new Сontroller();

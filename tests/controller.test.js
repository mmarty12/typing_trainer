const Сontroller = require('../controller');
const User = require('../user');
const Role = require('../roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { validationResult } = require('express-validator');

jest.mock('../user');
jest.mock('../roles');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config');
jest.mock('express-validator');

describe('Controller Tests', () => {
  let controller, req, res;

  beforeEach(() => {
    controller = new Сontroller();
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return message "server works"', async () => {
      await controller.getUsers(req, res);

      expect(res.json).toHaveBeenCalledWith('server works');
    });
  });

  describe('registration', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
      };
    });

    it('should redirect to signup_successful.html when all validations pass', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValueOnce(true),
      });
      User.findOne.mockResolvedValueOnce(null);
      bcrypt.hashSync.mockReturnValueOnce('hashedPassword');
      Role.findOne.mockResolvedValueOnce({ value: 'USER' });

      const saveMock = jest.fn();
      const userMock = {
        save: saveMock,
      };

      User.mockReturnValueOnce(userMock);

      await controller.registration(req, res);

      expect(res.redirect).toHaveBeenCalledWith('signup_successful.html');
    });

    it('should save a new user with hashed password when all validations pass', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValueOnce(true),
      });
      User.findOne.mockResolvedValueOnce(null);
      bcrypt.hashSync.mockReturnValueOnce('hashedPassword');
      Role.findOne.mockResolvedValueOnce({ value: 'USER' });

      const saveMock = jest.fn();
      const userMock = {
        save: saveMock,
      };

      User.mockReturnValueOnce(userMock);

      await controller.registration(req, res);

      expect(User).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'hashedPassword',
        roles: ['USER'],
      });
      expect(saveMock).toHaveBeenCalled();
    });

    it('should return a validation error if there are validation errors', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValueOnce(false),
      });

      await controller.registration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Registration error',
        errors: expect.any(Object),
      });
    });

    it('should return a user exists error if the user already exists', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValueOnce(true),
      });
      User.findOne.mockResolvedValueOnce({});

      await controller.registration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User with such name already exists',
      });
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return a registration error if an exception occurs', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValueOnce(true),
      });
      User.findOne.mockRejectedValueOnce(new Error('Database error'));

      await controller.registration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration error' });
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });
  });

  describe('login', () => {
    it('should log in the user and redirect to login_successful.html if credentials are valid', async () => {
      User.findOne.mockResolvedValueOnce({
        _id: 'testUserId',
        username: 'testuser',
        password: 'hashedPassword',
      });
      bcrypt.compareSync.mockReturnValueOnce(true);

      req.body.username = 'testuser';
      req.body.password = 'testpassword';

      const redirectMock = jest.fn();
      const res = {
        redirect: redirectMock,
      };

      await controller.login(req, res);

      expect(redirectMock).toHaveBeenCalledWith('login_successful.html');
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'testpassword',
        'hashedPassword'
      );
    });

    it('should return an error if the user does not exist', async () => {
      User.findOne.mockResolvedValueOnce(null);

      req.body.username = 'testuser';
      req.body.password = 'testpassword';

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User with such name does not exist',
      });
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return an error if the password is invalid', async () => {
      User.findOne.mockResolvedValueOnce({
        username: 'testuser',
        password: 'hashedPassword',
      });
      bcrypt.compareSync.mockReturnValueOnce(false);

      req.body.username = 'testuser';
      req.body.password = 'testpassword';

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'testpassword',
        'hashedPassword'
      );
    });

    it('should return an error if an exception occurs', async () => {
      User.findOne.mockRejectedValueOnce(new Error('Database error'));

      req.body.username = 'testuser';
      req.body.password = 'testpassword';

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login error' });
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });
  });
});

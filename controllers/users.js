require('dotenv').config();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const BAD_REQUEST_ERROR = require('../errors/BadRequestError');
const CONFLICT_ERROR = require('../errors/ConflictError');

const SUCCESS = 200;
const CREATE = 201;

let JWT_SECRET = '';
if (process.env.NODE_ENV === 'production') { JWT_SECRET = process.env.JWT_SECRET; } else { JWT_SECRET = 'cibirkulimay'; }

function createUser(req, res, next) {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({ ...req.body, password: hash })
        .then((user) => {
          res.status(CREATE).send({
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) next(new CONFLICT_ERROR('Пользователь с данным email уже существует'));
          if (err.name === 'ValidationError') {
            next(new BAD_REQUEST_ERROR(`${err.message}`));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
}

function updateUserProfile(req, res, next) {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) next(new CONFLICT_ERROR('Пользователь с данным email уже существует'));
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR(`${err.message}`));
      } else {
        next(err);
      }
    });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(req.body.email);
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = JWT.sign(
        { _id: user._id.valueOf() },
        JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );
      // res.clearCookie('jwt')
      console.log('login');
      console.log(token);
      res.cookie('jwt', token);
      return res
        .status(SUCCESS)
        .send({ message: 'Авторизация прошла ', email: user.email });
    })
    .catch(next);
}

function currentUser(req, res, next) {
  console.log(req.user._id);
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NOT_FOUND_ERROR('Такой ID не существует'));
      } else {
        next(err);
      }
    });
}

function loginOutUser(req, res) {
  res
    .clearCookie('jwt')
    .status(SUCCESS)
    .send({ message: 'Вы вышли из аккаунта' });
}

module.exports = {
  createUser,
  updateUserProfile,
  login,
  currentUser,
  loginOutUser,
};

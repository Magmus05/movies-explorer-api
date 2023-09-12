const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const UNAUTHORIZED_ERROR = require("../errors/UnauthorizedError");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Некорректный Email",
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },

},{versionKey: false});


userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {

      if (!user) {
        return Promise.reject(new UNAUTHORIZED_ERROR('Неправильные почта или пароль1'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UNAUTHORIZED_ERROR('Неправильные почта или пароль2'));
          }

          return user;
        });
    }).catch(next);
};


module.exports = mongoose.model("user", userSchema);
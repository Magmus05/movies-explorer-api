const jwt = require("jsonwebtoken");
const UNAUTHORIZED_ERROR = require("../errors/UnauthorizedError");
require('dotenv').config();
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) next(new UNAUTHORIZED_ERROR("Необходима авторизация"));
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(new UNAUTHORIZED_ERROR("Необходима авторизация"));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

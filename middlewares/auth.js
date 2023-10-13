require('dotenv').config();
const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/UnauthorizedError');
console.log('auth токен в самом начале');
console.log(jwt);
let JWT_SECRET = '';
if (process.env.NODE_ENV === 'production') { JWT_SECRET = process.env.JWT_SECRET; } else { JWT_SECRET = 'cibirkulimay'; }

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) next(new UNAUTHORIZED_ERROR(`Необходима авторизация //  test: ${process.env.TEST}`)); // проверяю подключен ли .env
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UNAUTHORIZED_ERROR('Необходима авторизация'));
  }
  console.log('auth токен в конце');
  console.log(token);
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

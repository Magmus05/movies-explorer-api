const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');

const regexLink = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;
const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/movies', auth, getMovies);

router.post(
  '/movies',
  auth,
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(50),
      director: Joi.string().required().min(2).max(50),
      duration: Joi.string().required().min(2).max(50),
      year: Joi.string().required().min(2).max(50),
      description: Joi.string().required().min(2),
      image: Joi.string().required().regex(new RegExp(regexLink)),
      trailerLink: Joi.string().required().regex(new RegExp(regexLink)),
      thumbnail: Joi.string().required().min(2).max(50),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2).max(50),
      nameEN: Joi.string().required().min(2).max(50),
    }),
  }),
  createMovies,
);

router.delete(
  '/movies/:movieId',
  auth,
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovies,
);

module.exports = router;

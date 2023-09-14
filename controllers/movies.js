const Movie = require('../models/movie');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const BAD_REQUEST_ERROR = require('../errors/BadRequestError');
const FORBIDDEN_ERROR = require('../errors/ForbiddenError');

const SUCCESS = 200;
const CREATE = 201;

function getMovies(req, res, next) {
  Movie.find({})
    .then((movies) => {
      const moviesCurrentUser = [];
      movies.forEach((movie) => {
        if (movie.owner.valueOf() === req.user._id) moviesCurrentUser.push(movie);
      });
      res.status(SUCCESS).send(moviesCurrentUser);
    })
    .catch(next);
}

function createMovies(req, res, next) {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(CREATE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR(`${err.message}`));
      } else {
        next(err);
      }
    });
}

function deleteMovies(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) throw new NOT_FOUND_ERROR('id фильма не найден.');
      if (movie.owner.valueOf() !== req.user._id) throw new FORBIDDEN_ERROR('У вас нет прав удалять чужие фильмы');
      Movie.findByIdAndRemove(req.params.movieId)
        .then((movieDelete) => {
          res
            .status(SUCCESS)
            .send({ message: `${movieDelete.nameRU} успешно удалён` });
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};

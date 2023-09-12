const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const {
  getMovies,
  createMovies,
  deleteMovies,
} = require("../controllers/movies");

router.get("/", auth, getMovies);

router.post(
  "/",
  auth,
  createMovies
);

router.delete(
  "/:movieId",
  auth,
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovies
);

module.exports = router;

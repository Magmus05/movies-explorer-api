require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const helmet = require("helmet");
const limiter = require("./rateLimiter/rateLimiter");

const app = express();

const routesUsers = require("./routes/users");
const routesMovies = require("./routes/movies");

const auth = require("./middlewares/auth");

const NOT_FOUND_ERROR = require("./errors/NotFoundError");
const handleErrors = require("./middlewares/handleErrors");

const { PORT_DIP = 3002, DB_URL_DIP = "mongodb://127.0.0.1:27017/bitfilmsdb" } =
  process.env;
const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://dip.magmus-web.ru"],
    credentials: true,
    maxAge: 30,
  })
); //
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger); // логгер запросов

app.use(limiter);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use(helmet());
app.use(routesUsers);
app.use(routesMovies);
app.use("/", auth, (req, res, next) => {
  next(new NOT_FOUND_ERROR("Не верный адрес"));
});

app.use(errorLogger); // логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(handleErrors); // централизованный обработчик ошибок

mongoose
  .connect(DB_URL_DIP, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(PORT_DIP, () => {
  console.log(`слушаем порт: ${PORT_DIP} ${process.env.TEST}`);
});

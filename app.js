"use strict";

const { loadEnvironmentVariables } = require("./utils/env");
loadEnvironmentVariables();
const dotenv = require('dotenv');


require("./models");
const express = require("express");
const cors = require("cors");

const app = express();
// const mainRouter = require("./routers/index");
// const { MEDIA_ROOT_ENDPOINT, ApiRoutes } = require("./utils/constants");
// const errorLoggerMiddleware = require("./middlewares/logging");

// app.use(MEDIA_ROOT_ENDPOINT, express.static("media"));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000,
  }),
);
app.use(cors());

// app.use(ApiRoutes.API, mainRouter);

// error handler
// app.use(errorLoggerMiddleware);

module.exports = app;

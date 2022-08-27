const express = require("express");
const { ApiRoutes } = require("../utils/apiRoutes");

const coreRouter = require("./coreRouter");
const mainRouter = express.Router();
mainRouter.use("/core", coreRouter);

module.exports = mainRouter;
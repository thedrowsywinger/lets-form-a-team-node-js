const express = require("express");

const coreRouter = require("./coreRouter");
const mainRouter = express.Router();
mainRouter.use("/core", coreRouter);

module.exports = mainRouter;
"use strict";

const { loadEnvironmentVariables } = require("../utils/env");
loadEnvironmentVariables();

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
/**
 * @type {Sequelize}
 */
// @ts-ignore
let sequelize = null;

if (config.use_env_variable) {
  // @ts-ignore
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

sequelize
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(String(err)));

module.exports = {
  sequelize,
  DataTypes
}
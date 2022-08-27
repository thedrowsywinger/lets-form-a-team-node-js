/* eslint-disable indent */
const path = require("path");

function loadEnvironmentVariables() {
  const CURRENT_ENV = process.env.NODE_ENV;
  // loads up different env files based on current environment type
  const envFileName =
    CURRENT_ENV === "development"
      ? ".env.local"
      : CURRENT_ENV === "production"
        ? ".env.prod"
        : ".env.test";
  const envFilePath = path.resolve(__dirname, "..", "env", envFileName);
  console.log("########### CURRENT ENVIRONMENT ###########")
  console.log(envFilePath)
  const dotenv = require("dotenv");
  const result = dotenv.config({
    path: envFilePath,
  });

  if (Object.keys(result).includes("error")) {
    throw new Error(
      "Dotenv failed. Could not load env file. Maybe the path is wrong? " +
      envFilePath,
    );
  }
}

module.exports = {
  loadEnvironmentVariables,
};

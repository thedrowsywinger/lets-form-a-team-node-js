const { sequelize } = require("../config/sequelize");
const { StatusCodes: EHttpStatusCodes } = require("http-status-codes");
const { QueryTypes } = require("sequelize");
const ApiResponseMessages = require("../utils/apiResponseMessages");

const testRouter = async (req, res) => {
  try {

    console.log("Router Testing")

  } catch (e) {
    res.status(400).sendResponse(
      res,
      EHttpStatusCodes.BAD_REQUEST,
      ApiResponseMessages.SYSTEM_ERROR
    )
  }
}

module.exports = (
  testRouter
)
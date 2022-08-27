const { sequelize } = require("../config/sequelize");
const { QueryTypes } = require("sequelize");
const ApiResponseMessages = require("../utils/apiResponseMessages");

const testController = async (req, res) => {
  try {
    console.log("Router Testing")
    res.status(200).send(
      {
        message: ApiResponseMessages.SUCCESS,
      }
    )

  } catch (e) {
    res.status(400).sendResponse(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

module.exports = (
  testController
)
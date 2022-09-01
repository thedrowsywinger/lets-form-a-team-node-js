const jwt = require("jsonwebtoken");
const { EAccountTypes } = require("../utils/constants");
const ApiResponseMessages = require("../utils/apiResponseMessages");
const { StatusCodes: EHttpStatusCodes } = require("http-status-codes");

const JWT_SECRET_KEY = String(process.env.JWT_SECRET_KEY);
const JWT_REFRESH_TOKEN_SECRET_KEY = String(process.env.JWT_REFRESH_TOKEN_KEY);

const { sequelize } = require("../models");

const { AuthUser } = require("../models/core");
const { AccountType } = require("../models/accountType");
const { Profile, ProfileTypeMap } = require("../models/profile");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
const auth = async (req, res, next) => {
  try {
    if (!req.header || !req.header("Authorization")) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send(
        {
          "message": ApiResponseMessages.INVALID_JWT
        }
      )
    }

    const token = req.header("Authorization")?.replace("jwt ", "");

    if (!token) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send(
        {
          "message": ApiResponseMessages.INVALID_JWT
        }
      )
    }

    let decoded;
    decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded) {
      decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET_KEY);
    }

    if (!decoded) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send(
        {
          "message": ApiResponseMessages.INVALID_JWT
        }
      )
    }

    req["decoded"] = decoded;
    req["userId"] = parseInt(decoded["_id"]);

    const profileInstance = await Profile.findOne({
      where: {
        userId: parseInt(decoded["_id"]),
      },
    });

    if (!profileInstance) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send(
        {
          "message": ApiResponseMessages.INVALID_JWT
        }
      )
    }

    const profileTypeMapInstance = await ProfileTypeMap.findOne(
      { where: { ProfileId: profileInstance.id } }
    )

    const accountType = await AccountType.findOne({
      where: { id: profileTypeMapInstance.AccountTypeId },
    });

    if (!accountType) {
      return res.status(EHttpStatusCodes.UNAUTHORIZED).send(
        {
          "message": ApiResponseMessages.INVALID_JWT
        }
      )
    }

    req["profileId"] = profileInstance.id;
    req["authUserId"] = profileInstance.userId;
    req["accountType"] = accountType.accountTypeId;

    console.log(req)


    return next();
  } catch (e) {
    return res.status(400).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function checkSuperAdmin(req, res, next) {
  if (
    req["accountType"] === EAccountTypes.SUPER_ADMIN
  ) {
    return next();
  }

  return res.status(400).send(
    {
      "message": ApiResponseMessages.UNAUTHORIZED_ACCESS
    }
  )
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function checkManager(req, res, next) {
  if (
    req["accountType"] === EAccountTypes.MANAGER
  ) {
    return next();
  }

  return res.status(400).send(
    {
      "message": ApiResponseMessages.UNAUTHORIZED_ACCESS
    }
  )
}

module.exports = {
  auth,
  checkSuperAdmin,
  checkManager
}
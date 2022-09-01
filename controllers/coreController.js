const { sequelize } = require("../config/sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwtRefreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_KEY;

const { QueryTypes } = require("sequelize");
const { StatusCodes: EHttpStatusCodes } = require("http-status-codes");

const { AuthUser } = require("../models/core");
const { AccountType } = require("../models/accountType");
const { Profile, ProfileTypeMap } = require("../models/profile");

const ApiResponseMessages = require("../utils/apiResponseMessages");
const { EAccountTypes } = require("../utils/constants");


const testController = async (req, res) => {
  try {
    return res.status(EHttpStatusCodes.ACCEPTED).send(
      {
        message: ApiResponseMessages.SUCCESS,
      }
    )

  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

const seederRequestController = async (req, res) => {
  try {

    const transaction = await sequelize.transaction();
    var superAdminAccountTypeInstance = await AccountType.findOne({
      where: {
        "accountTypeId": EAccountTypes.SUPER_ADMIN
      }
    })
    if (!superAdminAccountTypeInstance) {
      var superAdminAccountTypeInstance = await AccountType.create(
        {
          "accountTypeName": "Super Admin",
          "accountTypeId": EAccountTypes.SUPER_ADMIN
        }
      )
    }

    var managerAccountTypeInstance = await AccountType.findOne({
      where: {
        "accountTypeId": EAccountTypes.MANAGER
      }
    })
    if (!managerAccountTypeInstance) {
      var managerAccountTypeInstance = await AccountType.create(
        {
          "accountTypeName": "Manager",
          "accountTypeId": EAccountTypes.MANAGER
        }
      )
    }

    var employeeAccountTypeInstance = await AccountType.findOne({
      where: {
        "accountTypeId": EAccountTypes.EMPLOYEE
      }
    })
    if (!employeeAccountTypeInstance) {
      var employeeAccountTypeInstance = await AccountType.create(
        {
          "accountTypeName": "Employee",
          "accountTypeId": EAccountTypes.EMPLOYEE
        }
      )
    }

    const superAdminInstance = await AuthUser.findOne({
      where: {
        username: "superAdmin"
      }
    })
    if (!superAdminInstance) {
      const authUserInstance = await AuthUser.create({
        "username": "superAdmin",
        "password": "super_admin1",
      })

      const userProfileInstance = await Profile.create({
        "name": "Super Admin",
        "contactNumber": "01837645524",
        "email": "",
        "userId": authUserInstance.id
      })

      const profileAccountTypeMapping = await ProfileTypeMap.create({
        "AccountTypeId": superAdminAccountTypeInstance.id,
        "ProfileId": userProfileInstance.id
      })
    }

    await transaction.commit();

    return res.status(EHttpStatusCodes.ACCEPTED).send({
      "message": ApiResponseMessages.SUCCESS
    })


  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

const loginController = async (req, res) => {
  try {

    const body = req.body;
    const userInstance = await AuthUser.findOne({ where: { "username": body.username } });

    if (!userInstance) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send(
        {
          "message": ApiResponseMessages.INVALID_USER
        }
      )
    }

    const match = await bcrypt.compare(body.password, userInstance.password);
    if (!match) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send(
        {
          "message": ApiResponseMessages.USERNAME_PASSWORD_MISMATCH
        }
      )
    }

    const token = jwt.sign(
      // @ts-ignore
      { _id: userInstance.id.toString() },
      // @ts-ignore
      JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    console.log("am i here")
    console.log(userInstance.id)
    const profileInstance = await Profile.findOne(
      {
        where: { "userId": userInstance.id }
      }
    )
    const profileTypeMapInstance = await ProfileTypeMap.findOne(
      {
        where: { "ProfileId": profileInstance.id }
      }
    )
    const accountTypeInstance = await AccountType.findOne(
      {
        where: { id: profileTypeMapInstance.AccountTypeId }
      }
    )

    req['userId'] = userInstance.id;
    req['profileId'] = profileInstance.id;
    req['accountType'] = accountTypeInstance.accountTypeId;

    const data = {
      message: ApiResponseMessages.SUCCESS,
      accessToken: token,
      profile: profileInstance
    }

    return res.status(EHttpStatusCodes.ACCEPTED).send(data);
  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

const registerEmployeeController = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();
    const body = req.body
    const accountTypeInstance = await AccountType.findOne({
      where: {
        accountTypeId: body.accountType
      }
    })
    if (accountTypeInstance) {
      if (accountTypeInstance.accountTypeId === EAccountTypes.MANAGER) {
        if (req.accountType === EAccountTypes.SUPER_ADMIN) {
          var authUserExists = await AuthUser.findOne({
            where: { username: body.username }
          })
          if (authUserExists) {
            return res.status(EHttpStatusCodes.BAD_REQUEST).send({
              "message": ApiResponseMessages.USERNAME_ALREADY_EXISTS
            })
          } else {
            var authUserExists = await AuthUser.findOne({
              where: { username: body.username }
            })
            if (authUserExists) {
              return res.status(EHttpStatusCodes.BAD_REQUEST).send({
                "message": ApiResponseMessages.USERNAME_ALREADY_EXISTS
              })
            } else {
              var authUserInstance = await AuthUser.create(
                {
                  "username": body.username,
                  "password": body.password
                }
              )

              var userProfileInstance = await Profile.create(
                {
                  "name": body.name,
                  "contactNumber": body.contactNumber,
                  "email": body.email,
                  "userId": authUserInstance.id,
                  "createdBy": req.userId,
                  "updatedBy": req.userId
                }
              )

              var profileAccountTypeMapping = await ProfileTypeMap.create(
                {
                  "AccountTypeId": accountTypeInstance.id,
                  "ProfileId": userProfileInstance.id
                }
              )
            }

          }
        }
      } else if (accountTypeInstance.accountTypeId === EAccountTypes.EMPLOYEE) {
        if (req.accountType === EAccountTypes.SUPER_ADMIN || req.accountType === EAccountTypes.MANAGER) {
          var authUserExists = await AuthUser.findOne({
            where: { username: body.username }
          })
          if (authUserExists) {
            return res.status(EHttpStatusCodes.BAD_REQUEST).send({
              "message": ApiResponseMessages.USERNAME_ALREADY_EXISTS
            })
          } else {
            var authUserInstance = await AuthUser.create(
              {
                "username": body.username,
                "password": body.password
              }
            )

            var userProfileInstance = await Profile.create(
              {
                "name": body.name,
                "contactNumber": body.contactNumber,
                "email": body.email,
                "userId": authUserInstance.id,
                "createdBy": req.userId,
                "updatedBy": req.userId
              }
            )

            var profileAccountTypeMapping = await ProfileTypeMap.create(
              {
                "AccountTypeId": accountTypeInstance.id,
                "ProfileId": userProfileInstance.id
              }
            )
          }
        }
      } else {
        return res.status(EHttpStatusCodes.BAD_REQUEST).send(
          {
            "message": ApiResponseMessages.NO_OTHER_USER_ALLOWED
          }
        )
      }
      await transaction.commit();
      return res.status(EHttpStatusCodes.ACCEPTED).send({
        "message": ApiResponseMessages.SUCCESS,
        "data": {
          "id": userProfileInstance.id,
          "username": authUserInstance.username,
          "name": userProfileInstance.name,
          "contactNumber": userProfileInstance.contactNumber,
          "email": userProfileInstance.email,
          "accountType": accountTypeInstance.accountTypeName
        }
      })
    } else {
      res.status(EHttpStatusCodes.BAD_REQUEST).send({
        "message": ApiResponseMessages.INVALID_ACCOUNT_TYPE
      })
    }
    return res.status(EHttpStatusCodes.ACCEPTED).send(
      {
        "message": ApiResponseMessages.SUCCESS,
      }
    )

  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

const getUsersController = async (req, res) => {
  try {

    const users = await Profile.findAll()
    if (users.length === 0) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send(
        {
          "message": ApiResponseMessages.NO_USERS
        }
      )
    }
    return res.status(EHttpStatusCodes.ACCEPTED).send(
      {
        "message": ApiResponseMessages.SUCCESS,
        "data": users
      }
    )
  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

const getUserByIdController = async (req, res) => {
  try {

    const user = await Profile.findOne({ where: { id: req.query.id } })
    if (!user) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send(
        {
          "message": ApiResponseMessages.INVALID_USER
        }
      )
    }
    return res.status(EHttpStatusCodes.ACCEPTED).send(
      {
        "message": ApiResponseMessages.SUCCESS,
        "data": user
      }
    )
  } catch (e) {
    return res.status(EHttpStatusCodes.BAD_REQUEST).send(
      {
        "message": ApiResponseMessages.SYSTEM_ERROR
      }
    )
  }
}

module.exports = {
  testController,
  seederRequestController,
  registerEmployeeController,
  loginController,
  getUsersController,
  getUserByIdController
}
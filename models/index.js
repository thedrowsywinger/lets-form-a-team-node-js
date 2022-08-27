"use strict";
const { loadEnvironmentVariables } = require("../utils/env");
loadEnvironmentVariables();
const { sequelize, DataTypes } = require("../config/sequelize");
const env = process.env.NODE_ENV || "development";

sequelize.authenticate().then(() => {
  console.log("DATABASE AUTHENTICATION SUCCESSFUL");
})

const {
  AuthUser
} = require("./core")
const {
  AccountType
} = require("./accountType")
const {
  Profile,
  ProfileTypeMap
} = require("./profile")

const applyRelationshipSetup = (sequelize) => {
  /* Profile Created By Info */
  AuthUser.hasMany(Profile, {
    foreignKey: 'createdBy',
    sourceKey: 'id',
    allowNull: true
  });
  Profile.belongsTo(AuthUser, {
    foreignKey: 'createdBy',
    targetKey: 'id',
    allowNull: true
  });
  /* Profile Created By Info */
  /* Profile Updated By Info */
  AuthUser.hasMany(Profile, {
    foreignKey: 'updatedBy',
    sourceKey: 'id',
    allowNull: true
  });
  Profile.belongsTo(AuthUser, {
    foreignKey: 'updatedBy',
    targetKey: 'id',
    allowNull: true
  });
  /* Profile Updated By Info */
  /* Account Type Profile Mapping */
  AccountType.belongsToMany(Profile, {
    through: ProfileTypeMap,
  });
  Profile.belongsToMany(AccountType, {
    through: ProfileTypeMap,
  });
  /* Account Type Profile Mapping */
}

applyRelationshipSetup(sequelize);

const db = {}
db.sequelize = sequelize;
db.AuthUser = AuthUser;
db.AccountType = AccountType;
db.Profile = Profile;

if (env === "development") {
  db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database has been synced");
  });
}
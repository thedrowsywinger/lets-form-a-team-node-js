const { sequelize, DataTypes } = require("../config/sequelize")
const AuthUser = require("./core")

const Profile = sequelize.define("Profile", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

const ProfileTypeMap = sequelize.define("ProfileTypeMap", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
});

module.exports = {
  Profile,
  ProfileTypeMap
}
const bcrypt = require("bcryptjs");
const { sequelize, DataTypes } = require("../config/sequelize")

const AuthUser = sequelize.define("AuthUser", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

AuthUser.addHook("beforeCreate", async (user, option) => {
  user.password = await bcrypt.hash(user.password, 8);
});

module.exports = {
  AuthUser
}

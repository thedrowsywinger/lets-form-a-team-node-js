const { sequelize, DataTypes } = require("../config/sequelize")

const AccountType = sequelize.define("AccountType", {
  accountTypeName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  accountTypeId: {
    type: DataTypes.INTEGER
  }
});

module.exports = {
  AccountType
}
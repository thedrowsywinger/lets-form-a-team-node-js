let yup = require("yup");
const { EAccountTypes } = require("../utils/constants");
const {
  nameSchema,
  contactNumberSchema,
  emailSchema,
  usernameSchema,
  passwordSchema
} = require("./common");

const userProfileRegistrationSchema = yup.object({
  username: usernameSchema.required(),
  password: passwordSchema.required(),
  name: nameSchema.required(),
  contactNumber: contactNumberSchema.required(),
  email: emailSchema.required(),
  accountType: yup.number().required().oneOf([...Object.values(EAccountTypes)].map((value) => Number(value))),
})

module.exports = {
  userProfileRegistrationSchema
}
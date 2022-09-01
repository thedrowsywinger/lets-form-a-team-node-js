let yup = require("yup");
const { EAccountTypes } = require("../utils/constants");
const {
  nameSchema,
  contactNumberSchema,
  emailSchema,
  usernameSchema,
  passwordSchema
} = require("./common");

const ApiResponseMessages = require("../utils/apiResponseMessages")

const userProfileRegistrationSchema = yup.object({
  username: usernameSchema.required(),
  password: passwordSchema.required(),
  name: nameSchema.required(),
  contactNumber: contactNumberSchema.required(),
  email: emailSchema.required(),
  accountType: yup.number().required().oneOf([...Object.values(EAccountTypes)].map((value) => Number(value))),
})

const refreshTokenSchema = yup.object({
  accessToken: yup
    .string()
    .required()
    .test("starts_with_jwt_space", ApiResponseMessages.INVALID_JWT, (value) => {
      return Boolean(value) && value.length > 0 && value.startsWith("jwt ");
    }),
});

module.exports = {
  userProfileRegistrationSchema,
  refreshTokenSchema
}
const yup = require("yup");
const MIN_USERNAME_LENGTH = 6;
const MAX_USERNAME_LENGTH = 20;
const MIN_NAME_LENGTH = 4;
const MAX_NAME_LENGTH = 50;

const USERNAME_REGEX = new RegExp(/^[A-Za-z0-9.\-_]+$/);
// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
);
const BD_CONTACT_NUMBER_REGEX = new RegExp(/^01[0-9]{9}$/);
const EMAIL_REGEX = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

/**
 *
 * @param {number} minLength
 * @param {number} maxLength
 */
function ensureMinimumAndMaximumLengths(minLength = 6, maxLength = 20) {
  /**
   * @param {string | undefined} value
   */
  return function (value) {
    return (
      // @ts-ignore
      Boolean(value) && value.length >= minLength && value.length <= maxLength
    );
  };
}

/**
 *
 * @param {RegExp} pattern
 * @returns
 */
function testRegex(pattern) {
  /**
   * @param {string | undefined} value
   */
  return function (value) {
    // @ts-ignore
    return Boolean(value) && pattern.test(value);
  };
}

module.exports = {
  usernameSchema: yup
    .string()
    .test(
      "username_length",
      `Username must be at least ${MIN_USERNAME_LENGTH} characters and at most ${MAX_USERNAME_LENGTH} characters long`,
      ensureMinimumAndMaximumLengths(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH),
    )
    .test(
      "username_no_special_characters_except_underscores",
      "Usernames cannot contain any special characters other than '.', '-' and '_'",
      testRegex(USERNAME_REGEX),
    ),

  passwordSchema: yup
    .string()
    .test(
      "password_criteria",
      "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and no special characters",
      testRegex(PASSWORD_REGEX),
    ),

  nameSchema: yup
    .string()
    .test(
      "name_length",
      `Name should be between ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} number of characters`,
      ensureMinimumAndMaximumLengths(MIN_NAME_LENGTH, MAX_NAME_LENGTH),
    ),

  contactNumberSchema: yup
    .string()
    .test(
      "bd_contact_number",
      "Must be a valid Bangladeshi contact number",
      testRegex(BD_CONTACT_NUMBER_REGEX),
    ),

  emailSchema: yup.string().test("must be a valid email", testRegex(EMAIL_REGEX))
}
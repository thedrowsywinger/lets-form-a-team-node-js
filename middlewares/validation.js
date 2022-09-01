const { StatusCodes: EHttpStatusCodes } = require("http-status-codes");

/**
 *
 * @param {import("yup").AnyObjectSchema} schema
 * @returns {import("express").RequestHandler} Express Middleware
 */
function validateYupSchema(schema) {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  return async function (req, res, next) {
    try {
      await schema.validate(req.body);
      return next();
    } catch (err) {
      return res.status(EHttpStatusCodes.BAD_REQUEST).send(
        {
          "message": err
        }
      )
    };
  }
}

module.exports = {
  validateYupSchema,
};

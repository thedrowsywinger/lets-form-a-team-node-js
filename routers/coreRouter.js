const router = require("express").Router();

const ApiRoutes = require("../utils/apiRoutes");

const {
  testController,
  seederRequestController,
  registerEmployeeController,
  loginController,
  getUsersController,
  getUserByIdController
} = require("./../controllers/coreController");

const { validateYupSchema } = require("../middlewares/validation");

const {
  userProfileRegistrationSchema,
} = require("../validations/coreSchema");

const { auth } = require("../middlewares/auth");

router.post("/test/", testController);
router.post(ApiRoutes.SEEDER, seederRequestController);
router.post(
  ApiRoutes.REGISTER_USER,
  auth,
  validateYupSchema(userProfileRegistrationSchema),
  registerEmployeeController
)
router.post(
  ApiRoutes.LOGIN,
  loginController
)
router.get(
  ApiRoutes.GET_USERS,
  getUsersController
)
router.get(
  ApiRoutes.GET_USER_BY_ID,
  getUserByIdController
)


module.exports = router;
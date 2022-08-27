const router = require("express").Router();
const coreController = require("./../controllers/coreController");

router.post("/test/", coreController);

module.exports = router;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const router = require("express").Router();


router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;

const express = require("express");
const { Router } = express;
const router = new Router();
const logger = require('../../shared/log')

router.get("/", (req, res) => {
  res.send("Hello v1.0 GET API");
});

router.use("/user", require("./modules/user/routes"));
router.use("/insert", require("./modules/insert/routes"));
router.use("/warehouse", require("./modules/warehouse/routes"));

module.exports = router;

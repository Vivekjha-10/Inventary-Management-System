const express = require("express");
const { Router } = express;
const router = new Router();

const controller = require("./controller");
const { decryptRequest, validateToken } = require("../../../../middlewares/authentication")

router.post("/upload-details", decryptRequest, validateToken, controller.uploadNewRecord);

router.post("/delete-details", decryptRequest, validateToken, controller.deleteRecord);

module.exports = router;

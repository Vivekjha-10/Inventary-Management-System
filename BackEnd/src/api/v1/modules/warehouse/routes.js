const express = require("express");
const { Router } = express;
const router = new Router();

const controller = require("./controller");
const { decryptRequest, setToken, validateToken } = require("../../../../middlewares/authentication")

router.get("/section/:sectionId", decryptRequest, validateToken, controller.section);

router.post("/search-lot-no", decryptRequest, validateToken, controller.search_by_lot_no);
router.get("/search", decryptRequest, validateToken, controller.search);
router.post("/dashboard", decryptRequest, validateToken, controller.dashboard);

router.get("/master-list", decryptRequest, validateToken, controller.masterList);

router.post("/add-quantity", decryptRequest, validateToken, controller.addQuantity);
router.post("/dispatch-quantity", decryptRequest, validateToken, controller.dispatchQuantity);

router.get("/dispatch-list", decryptRequest, validateToken, controller.dispatchList);

router.post("/truncate-database", decryptRequest, validateToken, controller.truncateDatabase);

router.post("/add-new-record", decryptRequest, validateToken, controller.addNewRecord);
router.put("/update-record", decryptRequest, validateToken, controller.updateRecord);

router.post("/delete-record", decryptRequest, validateToken, controller.deleteRecord);

module.exports = router;

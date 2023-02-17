const express = require("express");
const router = express.Router();
const {
  addUserController,
  viewUserController,
  updateUserController
} = require("../controllers/user.controller");

router.post("/add", addUserController);
router.get("/view", viewUserController);
router.patch("/edit/:id", updateUserController);

module.exports = router;

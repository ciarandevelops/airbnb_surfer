const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/UsersController");
const fileUpload = require("../middleware/file-upload");

router.post(
  "/add-user",
  fileUpload.single("image"),
  UsersController.addNewUser
);

router.patch(
  "/update-user/:userId",
  fileUpload.single("image"),
  UsersController.updateProfile
);

router.delete("/delete-user/:userId", UsersController.deleteUser);

router.post("/login", UsersController.login);

router.route("/get-user/:userId").get(UsersController.getUserById);

module.exports = router;

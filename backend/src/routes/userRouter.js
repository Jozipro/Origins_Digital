const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../utils/Auth");

const userRouter = express.Router();

const uploadFolder = path.join(__dirname, "../../public/assets/images");
const upload = multer({ dest: uploadFolder });

const userController = require("../controllers/userController");

userRouter.get("/", userController.browse);
userRouter.get("/name", userController.findOne);

userRouter.get("/:id", userController.read);
userRouter.put("/:id", userController.edit);
userRouter.post(
  "/updatePassword",
  userController.login,
  auth.verifyEditPassword,
  userController.updateNewPassword
);
userRouter.post("/", userController.add);
userRouter.post("/login", userController.login, auth.verifyPassword);
userRouter.post("/:id", upload.single("link"), userController.addAvatar);
userRouter.use(auth.verifyAdmin);
userRouter.delete("/:id", userController.destroy);

module.exports = userRouter;

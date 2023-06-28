const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../utils/Auth");

const uploadFolder = path.join(__dirname, "../../public/assets/images/ads");

const upload = multer({
  dest: uploadFolder,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      const error = new Error("Only .jpg, .pnv and .svg format allowed!");
      error.status = 400;
      cb(null, false);

      return cb(error);
    }
    return req;
  },
});
const advertsRouter = express.Router();

const advertsController = require("../controllers/advertsController");

advertsRouter.get("/", advertsController.browse);
advertsRouter.get("/:id", advertsController.read);
advertsRouter.use(auth.verifyAdmin);
advertsRouter.put("/:id", advertsController.edit);
advertsRouter.delete("/:id", advertsController.destroy);
advertsRouter.post("/", upload.single("picture_link"), advertsController.add);

module.exports = advertsRouter;

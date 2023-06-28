const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../utils/Auth");

const uploadFolder = path.join(__dirname, "../../public/assets/videos");

const upload = multer({
  dest: uploadFolder,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/mpeg" ||
      file.mimetype === "video/quicktime" ||
      file.mimetype === "video/avi" ||
      file.mimetype === "video/mov" ||
      file.mimetype === "video/flv"
    ) {
      cb(null, true);
    } else {
      const error = new Error(
        "Only .mp4, .mpeg and .quicktime format allowed!"
      );
      error.status = 400;
      cb(null, false);

      return cb(error);
    }
    return req;
  },
});
const videoRoute = express.Router();

const VideoController = require("../controllers/VideoController");

videoRoute.get("/", VideoController.browse);
videoRoute.get("/adminFindAllVideos", VideoController.findAllVideoForAdmin);
videoRoute.get(
  "/allVideoAndFavorite/:id/:sectionId",
  VideoController.findAllVideoAndFavorite
);
videoRoute.get(
  "/allVideoAndFavorite/:id",
  VideoController.findAllVideoAndFavoriteWithoutSecID
);
videoRoute.get("/allData", VideoController.readAll);
videoRoute.get("/:id", VideoController.read);
videoRoute.use(auth.verifyAdmin);
videoRoute.put("/:id", VideoController.edit);
videoRoute.post("/", upload.single("link"), VideoController.add);
videoRoute.delete("/:id", VideoController.destroy);

module.exports = videoRoute;

const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../utils/Auth");

const videoSectionRouter = express.Router();
const uploadFolder = path.join(__dirname, "../../public/assets/videos");

const upload = multer({ dest: uploadFolder });
const VideoSectionController = require("../controllers/VideoSectionController");

videoSectionRouter.get("/", VideoSectionController.browse);
videoSectionRouter.get("/:id", VideoSectionController.read);
videoSectionRouter.use(auth.verifyAdmin);
videoSectionRouter.put("/:id", VideoSectionController.edit);
videoSectionRouter.post("/add_section", VideoSectionController.addSectionOnly);
videoSectionRouter.post("/", upload.single("link"), VideoSectionController.add);
videoSectionRouter.delete("/:id", VideoSectionController.destroy);

module.exports = videoSectionRouter;

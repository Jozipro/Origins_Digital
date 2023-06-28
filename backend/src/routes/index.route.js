const express = require("express");

const router = express.Router();

const user = require("./userRouter");
const videos = require("./video.route");
const sections = require("./section.route");
const categorie = require("./categorie.route");
const videoSection = require("./video_section.route");
const videosUser = require("./videos_user.route");
const adverts = require("./adverts.route");
const nodeMailer = require("./nodeMailerRoute");

router.use("/users", user);
router.use("/videos", videos);
router.use("/adverts", adverts);
router.use("/sections", sections);
router.use("/category", categorie);
router.use("/video_section", videoSection);
router.use("/videosUser", videosUser);
router.use("/nodeMailer", nodeMailer);

module.exports = router;

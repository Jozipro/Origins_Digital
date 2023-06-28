const express = require("express");

const videosUserRoute = express.Router();

const videosUserController = require("../controllers/Videos_userController");

videosUserRoute.get("/", videosUserController.browse);
videosUserRoute.get("/:id", videosUserController.read);
videosUserRoute.post("/", videosUserController.insert);
videosUserRoute.delete("/:videoId", videosUserController.destroy);

module.exports = videosUserRoute;

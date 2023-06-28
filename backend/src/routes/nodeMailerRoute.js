const express = require("express");

const nodeMailerRoute = express.Router();

const nodeMailerContact = require("../controllers/nodeMailerContact");

nodeMailerRoute.post("/", nodeMailerContact.initialize);
nodeMailerRoute.post("/sendWelcome", nodeMailerContact.welcomeMessage);

module.exports = nodeMailerRoute;

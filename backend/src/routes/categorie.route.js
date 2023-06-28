const express = require("express");
const auth = require("../utils/Auth");

const categorieRouter = express.Router();

const CategorieController = require("../controllers/CategorieController");

categorieRouter.get("/", CategorieController.browse);
categorieRouter.use(auth.verifyAdmin);
categorieRouter.post("/", CategorieController.add);
categorieRouter.delete("/:id", CategorieController.destroy);

module.exports = categorieRouter;

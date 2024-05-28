const {Router} = require("express");

const {createCategory, deleteCategory, readCategory, updateCategory} = require("../controllers/category.controller")

const route = Router();

route.get("/", readCategory);
route.post("/", createCategory);
route.put("/:id", updateCategory);
route.delete("/:id", deleteCategory);

module.exports = route;
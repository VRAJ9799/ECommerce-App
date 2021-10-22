const categoryController = require("../Controllers/CategoryController");
const { LoggedIn, Admin } = require("../Middleware/Auth");
const CategoryRouter = require("express").Router();

CategoryRouter.get("/", categoryController.GetCategories);
CategoryRouter.post(
  "/addcategory",
  LoggedIn,
  Admin,
  categoryController.AddCategory
);

module.exports = CategoryRouter;

const productController = require("../Controllers/ProductController");
const { LoggedIn, Admin } = require("../Middleware/Auth");
const ProductRouter = require("express").Router();

ProductRouter.get("/", productController.GetProducts);
ProductRouter.get("/:id", productController.GetProductById);
ProductRouter.post("/add", LoggedIn, Admin, productController.AddProduct);

module.exports = ProductRouter;

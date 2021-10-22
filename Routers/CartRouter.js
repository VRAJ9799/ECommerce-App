const cartController = require("../Controllers/CartController");
const { LoggedIn } = require("../Middleware/Auth");
const CartRouter = require("express").Router();

CartRouter.get("/", LoggedIn, cartController.getUserCart);
CartRouter.put("/addorupdate", LoggedIn, cartController.addOrUpdateCart);
CartRouter.delete(
  "/remove/:ProductId",
  LoggedIn,
  cartController.removeFromCart
);

module.exports = CartRouter;

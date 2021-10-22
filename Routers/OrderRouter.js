const orderController = require("../Controllers/OrderController");
const { LoggedIn, Admin } = require("../Middleware/Auth");
const OrderRouter = require("express").Router();

OrderRouter.get("/getAllOrders", LoggedIn, Admin, orderController.getAllOrders);
OrderRouter.get("/getMyOrders", LoggedIn, orderController.getAllUserOrders);
OrderRouter.get("/:orderId", LoggedIn, orderController.getOrderDetails);
OrderRouter.post("/place", LoggedIn, orderController.placeNewOrder);
OrderRouter.put("/pay/:orderId", LoggedIn, Admin, orderController.payment);
OrderRouter.put("/deliver/:orderId", LoggedIn, Admin, orderController.deliver);
OrderRouter.post(
  "/updatePaymentDetails",
  require("express").json({ type: "application/json" }),
  orderController.updatePaymentStatus
);

module.exports = OrderRouter;

const Carts = require("../Models/Carts");

class CartController {
  async getUserCart(req, res, next) {
    try {
      const cart = await Carts.find({
        User: req.user._id,
      })
        .sort({ createdAt: "desc" })
        .populate("ProductId", "Image Title Author Price Quantity")
        .select("ProductId QuantityPurchased");
      return res.status(200).json({ success: true, cart });
    } catch (error) {
      next(error);
    }
  }

  async addOrUpdateCart(req, res, next) {
    try {
      console.log(req.body);
      const { ProductId, Quantity } = req.body;
      await Carts.findOneAndUpdate(
        { ProductId, User: req.user._id },
        {
          $set: {
            QuantityPurchased: Quantity,
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, message: "Cart Updated" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async removeFromCart(req, res, next) {
    try {
      const { _id } = req.user;
      const { ProductId } = req.params;
      await Carts.findOneAndDelete({ ProductId, User: _id });
      return res.status(200).json({ success: true, message: "Item Removed" });
    } catch (error) {
      next(error);
    }
  }
}
const cartController = new CartController();
module.exports = cartController;

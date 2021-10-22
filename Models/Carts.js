const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    ProductId: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    QuantityPurchased: {
      type: Number,
      required: true,
      min: 1,
    },
    User: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
CartSchema.index({ ProductId: 1, User: 1 }, { unique: true });

const Carts = mongoose.model("Carts", CartSchema);

module.exports = Carts;

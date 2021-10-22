const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Comment: {
      type: String,
      required: true,
      maxlength: 200,
    },
    Rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    User: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
      type: String,
    },
    Price: {
      type: Number,
      required: true,
      min: [0, "Price Should be greater than 0"],
    },
    Image: {
      type: String,
      required: true,
    },
    Author: {
      type: String,
      required: true,
    },
    Category: {
      type: mongoose.Types.ObjectId,
      ref: "Categories",
    },
    Quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    Rating: {
      type: "Number",
      default: 0,
    },
    Views: {
      type: Number,
      default: 0,
    },
    Reviews: [ReviewSchema],
    AddedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    AddedOn: {
      type: Date,
      default: new Date(),
    },
    IsDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.post("save", async function (product, next) {
  try {
    if (product.Reviews && product.Reviews.length > 0) {
      product.Rating = Math.abs(
        product.Reviews.reduce((sum, item) => (sum += Number(item.Rating)), 0) /
          product.Reviews.length
      ).toFixed(1);
      await product.save();
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;

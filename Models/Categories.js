const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Description: {
      type: String,
    },
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
  { timestamps: true }
);

const Categories = mongoose.model("Categories", CategorySchema);
module.exports = Categories;

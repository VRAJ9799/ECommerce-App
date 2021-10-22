const mongoose = require("mongoose");
const Products = require("../Models/Products");
const ErrorHandler = require("../Middleware/ErrorHandler");
class ReviewController {
  async addReview(req, res, next) {
    try {
      const { ProductId, Title, Comment, Rating } = req.body;
      if (!ProductId || !Title || !Comment || !Rating)
        throw new ErrorHandler(422, "All Fields are required");
      const product = await Products.findById(ProductId);
      if (
        product.Reviews.filter((item) => item.User.equals(req.user._id))
          .length > 0
      )
        throw new ErrorHandler(422, "You already gave review");
      product.Reviews.push({
        Title,
        Comment,
        Rating,
        User: req.user._id,
      });
      await product.save();
      return res.status(201).json({ success: true, message: "Review Added" });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const { id } = req.params;
      const { ProductId, Title, Comment, Rating } = req.body;
      if (!mongoose.isValidObjectId(id))
        throw new ErrorHandler(422, "Invalid Review Id");
      if (!ProductId || !Title || !Comment || !Rating)
        throw new ErrorHandler(422, "All Fields are required");
      await Products.findOneAndUpdate(
        {
          _id: ProductId,
          "Reviews.User": req.user._id,
          "Reviews._id": id,
        },
        {
          $set: {
            "Reviews.$.Title": Title,
            "Reviews.$.Comment": Comment,
            "Reviews.$.Rating": Rating,
          },
        }
      );
      return res.status(200).json({ success: true, message: "Review Updated" });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { productId, reviewId } = req.params;
      if (!mongoose.isValidObjectId(reviewId))
        throw new ErrorHandler(422, "Invalid Review Id");
      await Products.findByIdAndUpdate(productId, {
        $pull: { Reviews: { _id: reviewId } },
      });
      return res.status(200).json({ success: true, message: "Review Deleted" });
    } catch (error) {
      next(error);
    }
  }
}

const reviewController = new ReviewController();
module.exports = reviewController;

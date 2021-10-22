const reviewController = require("../Controllers/ReviewController");
const ReviewRouter = require("express").Router();

ReviewRouter.put("/add", reviewController.addReview);
ReviewRouter.put("/update/:id", reviewController.updateReview);
ReviewRouter.put("/delete/:productId/:reviewId", reviewController.deleteReview);

module.exports = ReviewRouter;

const Categories = require("../Models/Categories");
const ErrorHandler = require("../Middleware/ErrorHandler");

class CategoryController {
  async GetCategories(req, res, next) {
    try {
      const categories = await Categories.find({ IsDeleted: false }).select({
        Title: 1,
      });
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      next(error);
    }
  }

  async AddCategory(req, res, next) {
    try {
      const { Title, Description } = req.body;
      if (!Title) {
        throw new ErrorHandler(422, "Title is required");
      }
      let category = await Categories.findOne({ Title });
      console.log(category);
      if (category) {
        throw new ErrorHandler(422, "Category Already Exist");
      }
      category = await Categories.create({
        Title,
        Description,
        AddedBy: req.user._id,
      });
      return res
        .status(201)
        .json({ success: true, message: "Category added successfully...!" });
    } catch (error) {
      next(error);
    }
  }
}
const categoryController = new CategoryController();
module.exports = categoryController;

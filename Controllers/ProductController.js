const ErrorHandler = require("../Middleware/ErrorHandler");
const CloudinaryImageUpload = require("../Utils/ImageUpload");
require("dotenv").config();
const Products = require("../Models/Products");

class ProductController {
  async GetProducts(req, res, next) {
    try {
      let query = {};
      let sortingQuery = {};
      let IsNext = false;
      //Filtering
      if (req.query.category) query["Category"] = req.query.category;

      if (req.query.rating)
        query["Rating"] = { $gte: Number(req.query.rating) };
      if (req.query.price) query["Price"] = { $gte: 0, $lte: req.query.price };
      //Sorting
      if (req.query.sortBy && req.query.sortOrder) {
        const { sortBy, sortOrder } = req.query;
        sortingQuery[sortBy] = sortOrder;
      }
      if (req.query.search) {
        let { search } = req.query;
        let regex = new RegExp(search, "i");
        query = { Title: { $regex: regex } };
      }
      query["IsDeleted"] = false;
      //Pagination
      let limit = Number(req.query.limit);
      let page = Number(req.query.page);
      let skip = limit * (page - 1);
      const products = await Products.find(query)
        .select({
          Title: 1,
          Rating: 1,
          Image: 1,
          Price: 1,
        })
        .sort(sortingQuery)
        .limit(limit)
        .skip(skip)
        .populate("Category", "Title");
      const totalCount = await Products.find(query).countDocuments();
      if (totalCount > page * limit) {
        IsNext = true;
      }
      return res.status(200).json({
        success: true,
        products,
        totalCount,
        IsNext,
        page,
      });
    } catch (error) {
      next(error);
    }
  }

  async GetProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Products.findById({
        _id: id,
        IsDeleted: false,
      })
        .populate("Category", "Title")
        .populate("Reviews.User", { Name: 1 });
      if (!product) {
        throw new ErrorHandler(404, "Product Not Found...!");
      }
      product.Views++;
      product.save();
      return res.status(200).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  }

  async AddProduct(req, res, next) {
    try {
      const { Title, Description, Quantity, Price, Author, Category } =
        req.body;
      const { ProductImage } = req.files;
      if (
        !Title ||
        !Quantity ||
        !Price ||
        !Author ||
        !Category ||
        !ProductImage
      )
        throw new ErrorHandler(422, "All Fields are required");
      await Products.create({
        Title,
        Description,
        Price,
        Quantity,
        Author,
        Image: await CloudinaryImageUpload(
          ProductImage,
          process.env.PRODUCT_FOLDER
        ),
        Category,
        AddedBy: req.user._id,
      });
      return res
        .status(201)
        .json({ success: true, message: "Product Created" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

const productController = new ProductController();
module.exports = productController;

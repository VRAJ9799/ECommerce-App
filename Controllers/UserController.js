const ErrorHandler = require("../Middleware/ErrorHandler");
const Users = require("../Models/Users");
const Orders = require("../Models/Orders");
const Products = require("../Models/Products");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const CloudinaryImageUpload = require("../Utils/ImageUpload");
const sendPasswordResetMail = require("../Utils/Mail");
require("dotenv").config();

class UserController {
  async getAllUsers(req, res, next) {
    try {
      let query = {};
      //filters
      if (req.query.role) {
        query = { Role: req.query.role };
      }
      if (req.query.search) {
        let regex = new RegExp(req.query.search, "i");
        query = {
          $or: [{ Name: { $regex: regex } }, { Email: { $regex: regex } }],
        };
      }
      //Pagination
      let limit = Number(req.query.limit ?? 10);
      let page = Number(req.query.page ?? 1);
      let skip = limit * (page - 1);
      const users = await Users.find(query).limit(limit).skip(skip);
      const totalCount = await Users.find(query).countDocuments();
      let isNext = totalCount > page * limit;
      return res.status(200).json({ success: true, totalCount, isNext, users });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      let { id } = req.params;
      if (!mongoose.isValidObjectId(id))
        throw new ErrorHandler(422, "Invalid User Id");
      //if(req.user._id !== id || req.user.Role!=="Admin") throw new ErrorHandler(403,"You don't have access to this");
      const user = await Users.findById({ _id: id });
      return res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { Name, Password, PhoneNumber } = req.body;
      if (!Name || !Password || !PhoneNumber)
        throw new ErrorHandler(422, "All fields are required");
      const user = await Users.findByIdAndUpdate(req.user._id, {
        Name,
        Password: bcrypt.hashSync(Password, 12),
        PhoneNo: PhoneNumber,
      });
      if (req.files) {
        user.ProfilePhoto = await CloudinaryImageUpload(
          req.files.ProfileImage,
          process.env.USER_FOLDER
        );
        await user.save();
      }
      if (user) {
        return res
          .status(200)
          .json({ message: "Details Updated", success: true, user });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { Email } = req.body;
      console.log(req.body);
      const user = await Users.findOne({ Email });
      if (!user) {
        throw new ErrorHandler(422, "User Not Registered");
      }
      const token = jwt.sign(
        { Email, id: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
          algorithm: "HS256",
        }
      );
      user.Token = token;
      await user.save();
      await sendPasswordResetMail(user.Name, user.Email, token);
      return res.status(200).json({
        message: "Mail has been send to your registered mail id",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password, token } = req.body;
      const payload = jwt.verify(token, "VrajShahForgotPassword", {
        algorithms: "HS256",
        ignoreExpiration: false,
      });
      const { id } = payload;
      const user = await Users.findById({ _id: id, IsDeleted: false });
      if (!user) {
        throw new ErrorHandler(422, "Invalid User");
      }
      if (user.Token === token) {
        user.Password = bcrypt.hashSync(password, 12);
        user.Token = undefined;
        await user.save();
        //Send Confirmation mail
        return res
          .status(200)
          .json({ success: true, message: "Password Changed Successfully" });
      } else {
        throw new ErrorHandler(404, "Invalid Link or Expired");
      }
    } catch (error) {
      if (error.message === "jwt expired") {
        error.message = "Invalid Link or Expired";
        error.status = 422;
      }
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id))
        throw new ErrorHandler(422, "Invalid User Id");
      await Users.findByIdAndDelete(id);
      await Orders.deleteMany({ User: id });
      await Products.deleteMany({ User: id });
      return res
        .status(200)
        .json({ success: true, message: "User Deleted Successfully" });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
module.exports = userController;

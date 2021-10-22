const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
      select: false,
    },
    PhoneNo: {
      type: String,
      minLength: 10,
      maxLength: 10,
    },
    ProfilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/vraj8725/image/upload/v1631975735/Users/d1rfprjxxtwd8tgulipf.png",
    },
    Role: {
      type: String,
      enum: {
        values: ["Customer", "Seller", "Admin"],
        message: "{value} is not supported",
      },
      default: "Customer",
    },
    Token: {
      type: String,
    },
    TokenExpiresOn: {
      type: Date,
    },
    IsVerified: {
      type: Boolean,
      default: false,
    },
    IsDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.ComparePassword = function (Password) {
  const isValid = bcrypt.compareSync(Password, this.Password);
  return isValid;
};

UserSchema.methods.GenerateJWTToken = function (id, role, next) {
  try {
    const token = jwt.sign({ _id: id, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1D",
      algorithm: "HS256",
    });
    return token;
  } catch (error) {
    next(error);
  }
};

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;

const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../Middleware/ErrorHandler");

class AuthController {
  async registerUser(req, res, next) {
    try {
      const { Name, Email, Password, PhoneNumber, Role } = req.body;
      if (!Name || !Email || !Password || !PhoneNumber) {
        throw new ErrorHandler(422, "All Fields are required");
      }
      const userInDB = await Users.findOne({ Email });
      if (userInDB) throw new ErrorHandler(400, "Email Already Exist");
      await Users.create({
        Name,
        Email,
        Password: bcrypt.hashSync(Password, 12),
        PhoneNo: PhoneNumber,
        Role,
      });
      return res.status(201).json({ success: true, message: "User Created" });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { Email, Password } = req.body;
      if (!Email || !Password) {
        throw new ErrorHandler(422, "All Fields are required");
      }
      const user = await Users.findOne({ Email, IsDeleted: false }).select(
        "+Password"
      );
      if (!user) {
        throw new ErrorHandler(400, "User Don't Exist");
      }
      if (!user.ComparePassword(Password)) {
        throw new ErrorHandler(400, "Invalid Email or Password");
      }
      let token = user.GenerateJWTToken(user._id, user.Role, next);
      user.Password = null;
      return res
        .status(200)
        .json({ success: true, message: "Login Successful..!", user, token });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
module.exports = authController;

const jwt = require("jsonwebtoken");
const ErrorHandler = require("./ErrorHandler");

async function LoggedIn(req, res, next) {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new ErrorHandler(401, "You have to Login First");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("This Called");
      throw new ErrorHandler(401, "You have to Login first");
    }
    const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: "HS256",
      ignoreExpiration: false,
    });
    req.user = await require("../Models/Users").findOne({
      _id: payload._id,
      IsDeleted: false,
    });
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message = "Please Login Again";
      error.status = 401;
    }
    next(error);
  }
}

async function Admin(req, res, next) {
  try {
    if (req.user.Role === "Admin") {
      next();
    } else {
      throw new ErrorHandler(403, "You don't have access to this");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { LoggedIn, Admin };

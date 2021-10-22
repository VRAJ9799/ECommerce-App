const mongoose = require("mongoose");
require("dotenv").config();

function connectDatabase() {
  try {
    mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log(err);
          return process.exit(1);
        }
        console.log("Database is connected ");
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDatabase;

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const connectDatabase = require("./Utils/DB");
const { LoggedIn } = require("./Middleware/Auth");
const PORT = process.env.PORT || 5000;
connectDatabase();

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "File Should be less than 5MB",
  })
);

app.use("/auth", require("./Routers/AuthRouter"));
app.use("/user", require("./Routers/UserRouter"));
app.use("/product", require("./Routers/ProductRouter"));
app.use("/categories", require("./Routers/CategoryRouter"));
app.use("/cart", require("./Routers/CartRouter"));
app.use("/order", require("./Routers/OrderRouter"));
app.use("/review", LoggedIn, require("./Routers/ReviewRouter"));

app.use((error, request, response, next) => {
  return response.status(error.status || 500).json({
    success: false,
    status: error.status || 500,
    error: error.message || "Internal Server Error",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
    status: 404,
    success: false,
  });
});


app.listen(PORT, () => console.log(`Server is Listening on ${PORT}`));

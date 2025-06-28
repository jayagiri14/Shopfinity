const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

const db=require('./config/mongoose-connection');   

const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const index=require('./routes/index')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/user");
});
app.use("/owner", ownerRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
// app.use("/shop",index)
app.listen(5000);
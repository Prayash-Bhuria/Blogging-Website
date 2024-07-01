
const path = require("path");
const express = require("express");
const { connectToMongoDB } = require("./connect");
const cookiePaser = require("cookie-parser");


const Blog=require('./models/blogs')


const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb+srv://prayashbhuria931:helloatlas@cluster0.zdpw6cg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() =>
  console.log("Mongodb connected")
);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.get("/", async(req, res) => {
  const allBlogs=await Blog.find({})
  res.render("home", {
    user: req.user,
    blogs:allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

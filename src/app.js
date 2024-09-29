const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.use("/user/getData", userAuth, (req, res) => {
  res.send("all user data send");
});

app.get("/admin/getData", (req, res) => {
  res.send("all admin data send");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("admin data deleted");
});

app.listen(3000, () => {
  console.log("app is running on port number 3000");
});

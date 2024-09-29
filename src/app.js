const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log(req.query);
    if (req.query.name == "abhi" || req.query.id == 5) {
      next();
    } else {
      res.send("route handler 1");
    }
  },
  (req, res) => {
    console.log("user 2");
    //next();
    res.send("route handler 2");
  }
);

app.listen(3000, () => {
  console.log("app is running on port number 3000");
});

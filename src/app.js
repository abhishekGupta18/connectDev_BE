const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("data is successfully added");
  } catch (e) {
    res.status(400).send("data is not added" + e.message);
  }
});

// get user by email

app.get("/getUser", async (req, res) => {
  const userEmail = req.body.email;
  if (userEmail.length === 0) {
    res.send("user not exist");
  }
  try {
    const user = await User.find({ email: userEmail });
    res.send(user);
  } catch {
    res.status(400).send("something went wrong");
  }
});

// get all data

app.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch {
    res.status(400).send("something went wrong");
  }
});

// delete user

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  if (userId.length === 0) {
    res.send("user not found");
  }

  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch {
    res.status(400).send("something went wrong");
  }
});

// update data of user

app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    const updateAllowed = [
      "firstName",
      "lastName",
      "age",
      "about",
      "photoUrl",
      "password",
      "gender",
      "skills",
    ];

    const checkUpdate = Object.keys(data).every((k) =>
      updateAllowed.includes(k)
    );

    if (!checkUpdate) {
      throw new Error("update not allowed");
    }

    // if (req.body.skills.length > 10) {
    //   throw new Error("skills more than 10 is not allowed");
    // }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user + " updated");
  } catch (e) {
    res.status(400).send("something went wrong !! " + e.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established..");
    app.listen(3000, () => {
      console.log("app is running on server 3000");
    });
  })
  .catch((e) => {
    console.log("DB connection failed.." + e.message);
  });

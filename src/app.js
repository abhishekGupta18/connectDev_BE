const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validationSignUpData } = require("./utilities/validation");
const bcyrpt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  try {
    // validating user data
    validationSignUpData(req);

    const { firstName, lastName, password, email, gender } = req.body;
    // encrypt password

    const enryptedPassword = await bcyrpt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      password: enryptedPassword,
      email,
      gender,
    });

    await user.save();
    res.send("data is successfully added");
  } catch (e) {
    res.status(400).send("data is not added" + e.message);
  }
});

// login api

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("write a valid emailid");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("wrong credentials");
    }

    const checkPassword = await bcyrpt.compare(password, user.password);

    if (checkPassword) {
      res.send("login successfully");
    } else {
      throw new Error("wrong credentials");
    }
  } catch (e) {
    res.status(400).send("Login failed " + e.message);
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

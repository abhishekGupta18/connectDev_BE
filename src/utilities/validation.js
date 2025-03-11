const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, password, email } = req.body;

  if (!firstName || !lastName) {
    throw new Error(" Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(" Password is not strong");
  }
};

const validationEditProfileData = (req) => {
  const allowEditData = [
    "firstName",
    "lastName",
    "age",
    "about",
    "gender",
    "skills",
    "photoUrl",
    "organization",
  ];

  const checkEditData = Object.keys(req.body).every((key) =>
    allowEditData.includes(key)
  );

  return checkEditData;
};
module.exports = { validationSignUpData, validationEditProfileData };

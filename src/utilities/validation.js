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

module.exports = { validationSignUpData };

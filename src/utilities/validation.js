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
    "githubUrl",
    "linkedlnUrl",
    "twitterUrl",
    "projectUrl",
  ];

  const checkEditData = Object.keys(req.body).every((key) =>
    allowEditData.includes(key)
  );

  return checkEditData;
};

const validateJobPostingData = (req) => {
  const reqFields = [
    "company",
    "role",
    "description",
    "salary",
    "applyLink",
    "experience",
    "location",
    "deadline",
  ];

  const missingFields = reqFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0)
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
};
module.exports = {
  validationSignUpData,
  validationEditProfileData,
  validateJobPostingData,
};

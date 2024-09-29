const adminAuth = (req, res, next) => {
  console.log("admin middleware");
  const token = "xyz";
  const isValidToken = token === "xyzj";

  if (!isValidToken) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user middleware");
  const token = "abc";
  const isValidToken = token === "abc";

  if (!isValidToken) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };

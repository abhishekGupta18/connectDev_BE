const handler = require("../src/abhi");

module.exports = async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({
      error: "Proxy Handler Error",
      message: error.message,
    });
  }
};

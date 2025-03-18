const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateJobPostingData } = require("../utilities/validation");
const Jobs = require("../models/jobs");

const jobsRouter = express.Router();

// posting jobs

jobsRouter.post("/jobs/post", userAuth, async (req, res) => {
  const user = req.user;
  try {
    // validate jobs data

    validateJobPostingData(req);

    const {
      company,
      role,
      description,
      salary,
      applyLink,
      experience,
      location,
      deadline,
    } = req.body;

    const job = new Jobs({
      userId: user._id,
      company: company.trim(),
      role: role.trim(),
      description: description.trim(),
      salary: salary.trim(),
      applyLink: applyLink.trim(),
      experience: experience.trim(),
      location: location.trim(),
      deadline,
    });

    await job.save();

    res.json({
      msg: "job added successfully",
      data: job,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

module.exports = jobsRouter;

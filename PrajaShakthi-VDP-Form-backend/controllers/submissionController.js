const Submission = require("../models/SubmissionModel");

// @desc   Create a new form submission
// @route  POST /api/submissions
// @access Private/User (handled by authMiddleware)
const createSubmission = async (req, res) => {
  try {
    // Since 'req.body' now contains the 'communityCouncil' array
    // and the SubmissionModel schema has been updated to include it,
    // Mongoose automatically maps and saves the new field.
    const newSubmission = new Submission(req.body);
    const savedSubmission = await newSubmission.save();

    console.log("Data saved successfully by user:", req.user._id);
    res.status(201).json({
      message: "Submission saved successfully!",
      data: savedSubmission,
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    res
      .status(500)
      .json({ message: "Error saving submission", error: error.message });
  }
};

// @desc   Get all submissions (with filtering for admin)
// @route   GET /api/submissions
// @access Private/Admin (handled by authMiddleware)
const getSubmissions = async (req, res) => {
  // ⭐ ADD formType to destructuring ⭐
  const { district, divisionalSec, gnDivision, formType } = req.query;
  const filter = {};

  // Build filter object based on query parameters
  if (district) {
    filter["location.district"] = district;
  }
  if (divisionalSec) {
    filter["location.divisionalSec"] = divisionalSec;
  }
  if (gnDivision) {
    filter["location.gnDivision"] = gnDivision;
  }
  // ⭐ ADD this new filter condition ⭐
  if (formType) {
    filter.formType = formType;
  }

  try {
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (submission) {
      await submission.deleteOne(); // or submission.remove() for older mongoose versions
      // Send status 204 No Content, which is standard for a successful DELETE
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Submission not found" });
    }
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  deleteSubmission,
};

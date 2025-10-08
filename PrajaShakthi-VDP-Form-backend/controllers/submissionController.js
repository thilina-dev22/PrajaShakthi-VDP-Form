const Submission = require('../models/SubmissionModel');

// @desc   Create a new form submission
// @route  POST /api/submissions
const createSubmission = async (req, res) => {
    try {
        const newSubmission = new Submission(req.body);
        const savedSubmission = await newSubmission.save();
        
        console.log('Data saved successfully:', savedSubmission);
        res.status(201).json({ message: "Submission saved successfully!", data: savedSubmission });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ message: "Error saving submission", error: error.message });
    }
};

// @desc   Get all submissions
// @route  GET /api/submissions
const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({}).sort({ createdAt: -1 }); // Get all, sorted by newest first
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissions, 
};
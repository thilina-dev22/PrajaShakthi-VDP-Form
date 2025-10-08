const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions } = require('../controllers/submissionController');

// Route for creating a new submission
router.post('/', createSubmission);

// Route for getting all submissions
router.get('/', getSubmissions);

module.exports = router;
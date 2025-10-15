// PrajaShakthi-VDP-Form-backend/routes/submissionRoutes.js

const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions, deleteSubmission, } = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware'); // NEW

// Route for creating a new submission (Requires login - user role for form submit)
router.post('/', protect, createSubmission);

// Route for getting and filtering submissions (Requires admin role)
router.get('/', protect, admin, getSubmissions);

// Route for deleting a submission (Requires admin role)
router.delete("/:id", protect, admin, deleteSubmission);

module.exports = router;
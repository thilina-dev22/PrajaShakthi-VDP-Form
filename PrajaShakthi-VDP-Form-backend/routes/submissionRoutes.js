// PrajaShakthi-VDP-Form-backend/routes/submissionRoutes.js

const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions, deleteSubmission, } = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware'); // auth still used for admin-only

// Public route for creating a new submission (no login required)
router.post('/', createSubmission);

// Route for getting and filtering submissions (Requires admin role)
router.get('/', protect, admin, getSubmissions);

// Route for deleting a submission (Requires admin role)
router.delete("/:id", protect, admin, deleteSubmission);

module.exports = router;
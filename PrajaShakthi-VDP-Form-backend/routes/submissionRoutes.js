// PrajaShakthi-VDP-Form-backend/routes/submissionRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createSubmission, 
    getSubmissions, 
    updateSubmission,
    deleteSubmission 
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// All submission routes now require authentication
router.post('/', protect, createSubmission); // DS users create submissions
router.get('/', protect, getSubmissions); // All authenticated users can view (filtered by role)
router.put('/:id', protect, updateSubmission); // DS users can edit their submissions
router.delete('/:id', protect, deleteSubmission); // Delete submission (role-based)

module.exports = router;
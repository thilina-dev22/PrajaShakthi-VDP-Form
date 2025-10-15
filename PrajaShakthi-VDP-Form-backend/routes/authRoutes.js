// PrajaShakthi-VDP-Form-backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, checkAuthStatus  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/status', protect, checkAuthStatus);

module.exports = router;
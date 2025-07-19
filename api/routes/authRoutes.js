const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/magic-link', AuthController.sendMagicLink);
router.post('/verify-token', AuthController.verifyToken);

module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// router setup
router.post('/register', register)
router.post('/login', login)

module.exports = router;
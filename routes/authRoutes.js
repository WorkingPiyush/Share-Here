const express = require('express');
const multer = require('multer');
const path = require('path');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// router setup
router.post('/signup', signup)
router.post('/login', login)

module.exports = router;
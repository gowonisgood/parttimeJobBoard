const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { jobPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

router.post('/jobs',isLoggedIn,jobPost);

module.exports = router;

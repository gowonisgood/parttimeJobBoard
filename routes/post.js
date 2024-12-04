const express = require('express');
const { jobPost, jobApply } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

router.post('/jobs', isLoggedIn, jobPost);

router.post('/jobs/:jobId/apply', isLoggedIn, jobApply);

module.exports = router;

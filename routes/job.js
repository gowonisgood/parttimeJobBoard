// routes/job.js

const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/index'); // 로그인 상태를 확인하는 미들웨어(예: passport 인증 여부)
const { renderJobDetail } = require('../controllers/job');

router.get('/:jobId', isLoggedIn, renderJobDetail);

module.exports = router;

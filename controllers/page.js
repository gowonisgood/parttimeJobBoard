const db = require(process.cwd() + '/models');

exports.renderProfile = async (req, res) => {
    try {
        // 현재 로그인한 사용자 ID 가져오기 (예: req.user.id)
        //req.user 같은 경우는 보통 미들웨어에서 알아서 사용자 정보로 됨 - passport/index.js에 구현해둠
        const userId = req.user.id;

        // 사용자 정보 조회
        const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user || user.length === 0) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        const role = user[0].role;
        let jobs = [];
        let appliedJobs = [];

        if (role === 'employer') {
            // Employer: 자신이 올린 공고 가져오기
            jobs = await db.query('SELECT * FROM jobs WHERE employer_id = ?', [userId]);
        } else if (role === 'employee') {
            // Employee: 자신이 지원한 공고 가져오기
            appliedJobs = await db.query(
                `SELECT j.* 
                 FROM applicants a 
                 JOIN jobs j ON a.job_id = j.id 
                 WHERE a.employee_id = ?`,
                [userId]
            );
        }

        // 템플릿에 데이터 렌더링
        res.render('profile', {
            title: '내 정보 - alba_platforms',
            users: user[0],
            jobs,
            appliedJobs
        });
    } catch (error) {
        console.error('Error rendering profile:', error);
        res.status(500).send('서버 에러가 발생했습니다.');
    }
};

exports.renderJoin = (req, res) =>{
    res.render('join',{title: '회원 가입 - alba_platforms'});
};

// controllers/page.js
exports.renderMain = async (req, res, next) => {
    try {
        const user = req.user; // 현재 로그인한 사용자 정보
        /*if (!user) {
            return res.redirect('/auth/login'); // 로그인하지 않은 경우 로그인 페이지로 이동
        }*/

        // 구인 공고 데이터 조회
        const [jobs] = await db.execute(`
            SELECT j.*, u.username AS employerName
            FROM jobs j
            JOIN users u ON j.employer_id = u.id
            ORDER BY j.id DESC
        `);

        // 각 공고에 지원자 정보 추가
        const applicantsPromises = jobs.map(async (job) => {
            const [applicants] = await db.execute(
                'SELECT a.employee_id FROM applicants a WHERE a.job_id = ?',
                [job.id]
            );
            return applicants.map((applicant) => applicant.employee_id);
        });

        const applicantsLists = await Promise.all(applicantsPromises);

        // 공고 데이터에 지원자 리스트를 추가
        const jobPosts = jobs.map((job, index) => ({
            ...job,
            applicants: applicantsLists[index],
        }));

        res.render('main', {
            title: 'Alba Platform',
            user, // 현재 사용자 정보 전달
            jobs: jobPosts, // 공고 데이터 전달
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};







const db = require(process.cwd() + '/models');

//프로필 렌더링
exports.renderProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!users || users.length === 0) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        const role = users[0].role;
        let jobs = [];
        let appliedJobs = [];

        if (role === 'employer') {
            const [jobResults] = await db.query('SELECT * FROM jobs WHERE employer_id = ?', [userId]);
            jobs = jobResults;
        } else if (role === 'employee') {
            const [appliedJobResults] = await db.query(
                `SELECT j.* 
                 FROM applicants a 
                 JOIN jobs j ON a.job_id = j.id 
                 WHERE a.employee_id = ?`,
                [userId]
            );
            appliedJobs = appliedJobResults;
        }

        res.render('profile', {
            title: '내 정보 - alba_platforms',
            user: users[0], // 'users'를 'user'로 변경
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
//Main 페이지 렌더링
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







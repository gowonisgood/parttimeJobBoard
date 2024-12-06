const db = require(process.cwd() + '/models');

exports.renderJobDetail = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id; // 현재 로그인한 사용자

        // 해당 job이 실제로 존재하는지 확인
        const [jobRows] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
        if (jobRows.length === 0) {
            return res.status(404).send('해당 공고를 찾을 수 없습니다.');
        }

        const job = jobRows[0];

        // 현재 로그인한 사용자가 이 공고의 등록 employer인지 확인
        if (job.employer_id !== userId) {
            return res.status(403).send('이 공고의 상세 정보를 볼 권한이 없습니다.');
        }

        // 지원자 정보 가져오기
        const [applicantsRows] = await db.query(`
            SELECT u.id, u.username
            FROM applicants a
            JOIN users u ON a.employee_id = u.id
            WHERE a.job_id = ?
        `, [jobId]);

        res.render('jobDetail', {
            title: `${job.title} 상세 정보`,
            user: req.user,
            job,
            applicants: applicantsRows
        });
    } catch (error) {
        console.error('Error rendering job detail:', error);
        res.status(500).send('서버 에러가 발생했습니다.');
    }
};

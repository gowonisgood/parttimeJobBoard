const db = require(process.cwd() + '/models');

exports.jobPost = async (req, res, next) => {
    try {
        // 사용자로부터 입력받은 데이터 가져오기
        const { title, description, wage } = req.body;
        const employerId = req.user.id; // 현재 로그인한 사용자의 ID (고용주)

        // 데이터 유효성 검사
        if (!title || !description || !wage) {
            return res.status(400).json({ message: "모든 필드를 채워주세요." });
        }

        // 데이터 삽입 쿼리 실행
        const query = `
            INSERT INTO jobs (title, description, wage, employer_id) 
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [title, description, wage, employerId]);

        res.redirect('/');
        // 성공적으로 생성되었음을 응답
        /*res.status(201).json({
            message: "구인 공고가 등록되었습니다.",
            job: { id: result.insertId, title, description, wage, employer_id: employerId },
        });*/
    } catch (err) {
        console.error(err);
        next(err); // 에러를 처리 미들웨어로 전달
    }
};

exports.jobApply = async (req, res, next) => {
    try {
        const jobId = req.params.jobId;
        const employeeId = req.user.id;

        // 필요한 값들이 정의되어 있는지 확인
        if (!jobId || !employeeId) {
            return res.status(400).json({ message: "잘못된 요청입니다." });
        }

        // 사용자 역할이 직원인지 확인
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: "직원만 지원할 수 있습니다." });
        }

        // 이미 지원했는지 확인
        const checkQuery = `
            SELECT * FROM applicants WHERE job_id = ? AND employee_id = ?
        `;
        const [rows] = await db.execute(checkQuery, [jobId, employeeId]);

        if (rows.length > 0) {
            return res.status(400).json({ message: "이미 이 공고에 지원하셨습니다." });
        }

        // 지원자 테이블에 추가
        const insertQuery = `
            INSERT INTO applicants (job_id, employee_id) VALUES (?, ?)
        `;
        await db.execute(insertQuery, [jobId, employeeId]);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
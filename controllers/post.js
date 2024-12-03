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

        // 새로운 구인 공고 추가
        const newJob = await db.Job.create({
            title,
            description,
            wage,
            employer_id: employerId,
        });

        // 성공적으로 생성되었음을 응답
        res.status(201).json({ message: "구인 공고가 등록되었습니다.", job: newJob });
    } catch (err) {
        console.error(err);
        next(err); // 에러를 처리 미들웨어로 전달
    }
};
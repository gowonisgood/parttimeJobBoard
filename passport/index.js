const passport = require('passport');
const local = require('./localStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
    // 세션에 사용자 ID 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 세션에서 사용자 ID를 이용해 사용자 정보 조회
    passport.deserializeUser(async (id, done) => {
        try {
            // 사용자 기본 정보 조회
            const [rows] = await db.execute('SELECT id, username, role FROM users WHERE id = ?', [id]);
            if (rows.length > 0) {
                const user = rows[0];

                // 팔로잉 및 팔로워 로직 제거 (스키마에 없음)
                /*user.followings = []; // 빈 배열로 설정
                user.followers = [];  // 빈 배열로 설정*/

                done(null, user); // 사용자 객체 반환
            } else {
                done(null); // 사용자 없음
            }
        } catch (err) {
            console.error(err);
            done(err); // 오류 처리
        }
    });

    // 로컬 로그인 전략 활성화
    local();
};

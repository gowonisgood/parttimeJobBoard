const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // 비밀번호 비교에 사용

const db = require(process.cwd() + '/models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, async (username, password, done) => {
        //디버깅용
        /*console.log('입력된 username:', username);
        console.log('입력된 password:', password);*/
        try {
            // 데이터베이스에서 사용자 조회
            const [rows] = await db.execute('SELECT id, username, password, role FROM users WHERE username = ?', [username]);
            if (rows.length === 0) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }

            const user = rows[0];

            // 비밀번호 검증
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }

            // 인증 성공
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));
};

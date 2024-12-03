const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require(process.cwd() + '/models');

//회원가입
exports.join = async (req, res, next) => {
    const { username, password, role } = req.body; // 역할(role) 추가
    try {
        // 중복된 username 확인
        const [rows] = await db.execute('SELECT * FROM users WHERE username=?', [username]);
        if (rows.length > 0) {
            return res.redirect('/join?error=exist'); // 중복 사용자 에러
        }

        // 비밀번호 해싱
        const hash = await bcrypt.hash(password, 12);

        // 사용자 데이터 삽입 (username, password, role)
        await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role]);

        // 회원가입 성공 시 홈으로 리다이렉트
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

//로그인
exports.login = (req, res, next) => {
    passport.authenticate('local', (authErr, user, info) => {
        if (authErr) {
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};

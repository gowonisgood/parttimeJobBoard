var express = require('express');
var app = express();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const nunjucks = require('nunjucks');
const session = require('express-session');
/*GO*/
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config(); //환경변수 초기화 자동으로 .env 파일이 로드 됨 , process.env 를 통해 사용 가능
/*GO*/


var usersRouter = require('./routes/users');
/*GO*/
const postRouter = require('./routes/post');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/job');
const{sequelize} = require('./models');
const passportConfig = require('./passport');
/*GO*/


/*GO*/
passportConfig();
/*GO*/


// view engine setup
/*GO*/
app.set('port',process.env.PORT || 8001);
/*GO*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //html로 수정함
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
}); //넌적스 설정

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*GO*/
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret:process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

/*GO*/



//라우터 설정
//app.use('/', indexRouter);
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/post', postRouter);
app.use('/jobs',jobRouter);

//에러처리
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message; // 템플릿에 전달할 메시지
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 환경에서만 에러 상세 표시
  res.status(err.status || 500); // 에러 상태 설정
  res.render('error'); // 에러 템플릿 렌더링
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 대기 중`);
});
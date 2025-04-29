# 알바 매칭 플랫폼

간단한 Express 기반 아르바이트 구인/구직 웹 애플리케이션입니다. 고용주(employer)는 구인 공고를 등록하고, 구직자(employee)는 공고에 지원할 수 있습니다.

---

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [기술 스택](#기술-스택)
3. [설치 및 실행](#설치-및-실행)
4. [데이터베이스 스키마](#데이터베이스-스키마)
5. [주요 기능](#주요-기능)
   - 고용주(Employer)
   - 구직자(Employee)
   - 공통 기능
6. [REST API 엔드포인트](#rest-api-엔드포인트)
7. [디렉터리 구조](#디렉터리-구조)
8. [인증 및 권한 관리](#인증-및-권한-관리)
9. [기여하기](#기여하기)
10. [라이선스](#라이선스)

---

## 프로젝트 소개

Express.js와 Passport.js를 이용하여 구현한 간단한 아르바이트 구인/구직 플랫폼입니다. 사용자는 `employer`(고용주)와 `employee`(구직자) 역할로 나뉘며, 각각 공고 작성 및 지원 기능을 제공합니다.

## 기술 스택

- Node.js (v16+)
- Express.js
- Passport.js (Local Strategy)
- Sequelize (또는 원하는 ORM)
- MySQL (또는 MariaDB)
- EJS (또는 다른 템플릿 엔진)

## 설치 및 실행

```bash
# 레포지토리 복제
git clone https://github.com/yourusername/partime-job-platform.git
cd partime-job-platform

# 의존성 설치
npm install

# 환경 변수 설정
# .env 파일에 데이터베이스 정보와 세션 시크릿 등 추가

# 데이터베이스 마이그레이션 및 시딩
npx sequelize db:migrate
npx sequelize db:seed:all

# 서버 시작
npm start
```

## 데이터베이스 스키마

### 1. users
| 컬럼       | 타입        | 설명                         |
|------------|-------------|------------------------------|
| id         | INT (PK)    | 자동 증가, 사용자 식별 번호  |
| username   | VARCHAR     | 고유 아이디                  |
| password   | VARCHAR     | 암호화된 비밀번호            |
| role       | ENUM        | `employer` 또는 `employee`   |

### 2. jobs
| 컬럼         | 타입        | 설명                                     |
|--------------|-------------|------------------------------------------|
| id           | INT (PK)    | 자동 증가, 공고 식별 번호                |
| title        | VARCHAR     | 공고 제목                                |
| description  | TEXT        | 공고 상세 설명                           |
| wage         | DECIMAL(10,2) | 시급 또는 월급                         |
| employer_id  | INT (FK)    | users.id (role='employer') 참조          |

### 3. applicants
| 컬럼         | 타입        | 설명                                     |
|--------------|-------------|------------------------------------------|
| id           | INT (PK)    | 자동 증가, 지원 내역 식별 번호          |
| job_id       | INT (FK)    | jobs.id 참조                             |
| employee_id  | INT (FK)    | users.id (role='employee') 참조          |

## 주요 기능

### 고용주 (Employer)
- **공고 작성** (`controllers/post.js`)
  - 공고 등록 시 DB에 저장
  - 메인 페이지에 최신 공고 렌더링 (`controllers/page.js`)
- **내 공고 관리** (`controllers/page.js`)
  - 프로필 페이지에서 자신이 작성한 공고 목록 조회
- **공고 상세 조회 및 지원자 관리** (`controllers/job.js`)
  - 지원자 목록 및 상세 정보 확인

### 구직자 (Employee)
- **공고 지원** (`controllers/post.js`)
  - 지원하기 버튼 클릭 시 applicants 테이블에 기록
- **지원 내역 조회** (`controllers/page.js`)
  - 프로필 클릭 시 자신이 지원한 공고 목록 조회

### 공통 기능
- **메인 페이지** (`controllers/page.js`)
  - 로그인 화면
  - 전체 공고 리스트 렌더링

## REST API 엔드포인트

| 메서드 | 경로              | 설명                             |
|--------|-------------------|----------------------------------|
| POST   | `/auth/signup`    | 회원가입 (employer/employee)     |
| POST   | `/auth/signin`    | 로그인                           |
| GET    | `/jobs`           | 공고 리스트 조회                |
| POST   | `/jobs`           | 공고 생성 (employer 전용)         |
| GET    | `/jobs/:id`       | 공고 상세 조회                  |
| POST   | `/jobs/:id/apply` | 공고 지원 (employee 전용)        |
| GET    | `/profile`        | 내 프로필 및 공고/지원 내역 조회|

## 디렉터리 구조

```
├─ app.js                 # 서버 진입점
├─ config/                # DB, Passport 설정
├─ controllers/           # 요청 핸들러
│  ├─ auth.js             # 로그인/회원가입
│  ├─ page.js             # 페이지 렌더링
│  ├─ post.js             # 글 작성/지원 처리
│  └─ job.js              # 공고 상세/지원자 관리
├─ middlewares/           # 커스텀 미들웨어
├─ passport/              # Passport 전략 설정
│  ├─ index.js
│  └─ localStrategy.js
├─ routes/                # REST API 라우터
└─ models/                # Sequelize 모델 정의
```

## 인증 및 권한 관리

- Passport.js Local Strategy 사용
- 로그인/회원가입: `controllers/auth.js`, `/middlewares` 및 `/passport`
- 역할 기반 접근 제어 미들웨어 적용

## 기여하기

1. Fork 프로젝트
2. 새로운 브랜치 생성 (`git checkout -b feature/YourFeature`)
3. 변경 사항 커밋 (`git commit -m "Add some feature"`)
4. 푸시 (`git push origin feature/YourFeature`)
5. Pull Request 생성

## 라이선스

MIT 라이선스


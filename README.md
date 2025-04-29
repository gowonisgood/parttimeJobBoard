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

---

# Part-Time Job Matching Platform

A simple Express-based web application for part-time job postings and applications. Employers can post job listings, and employees can apply to those listings.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Installation & Usage](#installation--usage)
4. [Database Schema](#database-schema)
5. [Key Features](#key-features)
   - Employer
   - Employee
   - Common Features
6. [REST API Endpoints](#rest-api-endpoints)
7. [Directory Structure](#directory-structure)
8. [Authentication & Authorization](#authentication--authorization)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

This is a simple part-time job matching platform built with Express.js and Passport.js. Users can register as an `employer` to post job listings or as an `employee` to apply for those listings.

## Tech Stack

- Node.js (v16+)
- Express.js
- Passport.js (Local Strategy)
- Sequelize (or any ORM of choice)
- MySQL (or MariaDB)
- EJS (or any templating engine)

## Installation & Usage

```bash
# Clone the repository
git clone https://github.com/yourusername/partime-job-platform.git
cd partime-job-platform

# Install dependencies
npm install

# Configure environment variables
# Add database credentials and session secret to .env

# Run database migrations and seed data
npx sequelize db:migrate
npx sequelize db:seed:all

# Start the server
npm start
```

## Database Schema

### 1. users
| Column     | Type        | Description                          |
|------------|-------------|--------------------------------------|
| id         | INT (PK)    | Auto-increment, user identifier      |
| username   | VARCHAR     | Unique user ID                       |
| password   | VARCHAR     | Encrypted password                   |
| role       | ENUM        | `employer` or `employee`             |

### 2. jobs
| Column        | Type           | Description                                 |
|---------------|----------------|---------------------------------------------|
| id            | INT (PK)       | Auto-increment, job listing identifier      |
| title         | VARCHAR        | Job title                                   |
| description   | TEXT           | Detailed job description                    |
| wage          | DECIMAL(10,2)  | Hourly wage or monthly salary               |
| employer_id   | INT (FK)       | References users.id where role='employer'    |

### 3. applicants
| Column        | Type      | Description                              |
|---------------|-----------|------------------------------------------|
| id            | INT (PK)  | Auto-increment, application identifier   |
| job_id        | INT (FK)  | References jobs.id                       |
| employee_id   | INT (FK)  | References users.id where role='employee'|

## Key Features

### Employer
- **Post Job** (`controllers/post.js`)
  - Save listing to the database
  - Display new listings on the main page (`controllers/page.js`)
- **Manage My Listings** (`controllers/page.js`)
  - View all job listings posted by the employer
- **View Listing Details & Applicants** (`controllers/job.js`)
  - See applicant list and detailed information

### Employee
- **Apply for Job** (`controllers/post.js`)
  - Record application in the applicants table upon clicking Apply
- **View My Applications** (`controllers/page.js`)
  - View all job listings the employee has applied to

### Common Features
- **Main Page** (`controllers/page.js`)
  - Login screen and list of all job listings

## REST API Endpoints

| Method | Path                | Description                         |
|--------|---------------------|-------------------------------------|
| POST   | `/auth/signup`      | Sign up as employer or employee     |
| POST   | `/auth/signin`      | Sign in                             |
| GET    | `/jobs`             | Get list of job listings            |
| POST   | `/jobs`             | Create a new job listing (employer only) |
| GET    | `/jobs/:id`         | Get job listing details             |
| POST   | `/jobs/:id/apply`   | Apply to a job listing (employee only) |
| GET    | `/profile`          | View own profile, listings/applications |

## Directory Structure

```
├─ app.js                 # Entry point
├─ config/                # DB and Passport configuration
├─ controllers/           # Request handlers
│  ├─ auth.js             # Authentication
│  ├─ page.js             # Page rendering
│  ├─ post.js             # Posting and applying logic
│  └─ job.js              # Listing details and applicant management
├─ middlewares/           # Custom middleware
├─ passport/              # Passport strategies
│  ├─ index.js
│  └─ localStrategy.js
├─ routes/                # REST API routers
└─ models/                # Sequelize models
```

## Authentication & Authorization

- Passport.js Local Strategy
- Authentication and signup handled in `controllers/auth.js`, `/middlewares`, and `/passport`
- Role-based access control via custom middleware

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

MIT Lic

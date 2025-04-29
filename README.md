# 알바 구인 공고 사이트
<DB 사용>
1. 사용자 테이블 (users)
이 테이블은 플랫폼에 등록된 모든 사용자를 저장.
주요 속성:
id: 각 사용자를 식별하는 고유 번호. 자동으로 증가.
username: 사용자의 고유 아이디. 중복될 수 없도록 설정.
password: 사용자의 비밀번호를 저장. 안전한 저장을 위해 암호화된 형태로 저장.
role: 사용자의 역할.
employer는 고용주를 의미하며, 구인 공고를 올릴 수 있음.
employee는 구직자를 의미, 공고에 지원할 수 있음.

2. 구인 공고 테이블 (jobs)
이 테이블은 고용주가 등록한 구인 공고를 저장.
주요 속성:
id: 각 구인 공고를 식별하는 고유 번호. 자동으로 증가.
title: 공고의 제목입니다. 예를 들어, "주말 카페 아르바이트".
description: 공고에 대한 상세 설명. 예를 들어, 업무 내용이나 근무 시간 등의 정보가 들어갈 수 있음.
wage: 해당 공고의 시급 또는 월급 정보를 저장. 소수점 두 자리까지 가능.
employer_id: 공고를 등록한 고용주의 사용자 ID. users 테이블의 id를 참조하는 외래 키.

3. 지원자 테이블 (applicants)
이 테이블은 구직자가 구인 공고에 지원한 내역을 저장.
주요 속성:
id: 각 지원 내역을 식별하는 고유 번호. 자동으로 증가.
job_id: 지원한 구인 공고의 ID. jobs 테이블의 id를 참조하는 외래 키.
employee_id: 지원한 구직자의 사용자 ID. users 테이블의 id를 참조하는 외래 키.

테이블 간 관계
users와 jobs
users 테이블의 id는 jobs 테이블의 employer_id와 연결되어 있음.
즉, users 테이블의 고용주(role='employer')가 구인 공고를 등록할 수 있음.
jobs와 applicants
jobs 테이블의 id는 applicants 테이블의 job_id와 연결되어 있음.
구직자는 특정 공고에 지원하기 위해 applicants 테이블에 데이터를 추가.
users와 applicants
users 테이블의 id는 applicants 테이블의 employee_id와 연결되어 있음.
구직자(role='employee')는 자신이 지원한 공고 정보를 applicants 테이블에 저장.


<핵심 시나리오 1가지 이상 결정 및 구현>
아르바이트 구인 모집 공고글 작성 및 지원 프로그램

employee와 employer의 기능을 따로 구현
employer 
아르바이트 구인 글 작성  (controllers/post.js)
구인글 작성시 DB에 저장(controllers/post.js)되고 , 메인 페이지에 렌더링 (controllers/page.js)됨.




프로필 조회 (controllers/page.js)
프로필 조회시 자신이 작성한 공고글을 볼 수 있음.




상세 보기 (controllers/job.js)
내가 올린 공고글의 상세 정보와 지원자 목록을 볼 수 있음.




employee
아르바이트 지원 (controllers/post.js)
지원하기 버튼을 이용하여 아르바이트 지원 가능













프로필 클릭 시 지원한 알바 목록을 볼 수 있음. (controllers/page.js)



공통 기능
Main 페이지 렌더링시 (/controllers/page.js)
가장 처음에는 로그인 화면 나옴
여태까지 올라온 공고글 화면에 표시






→ 더 자세한 코드는 controllers/page.js 에서 확인 가능

<로그인 기능 구현>
(/middlewares/index
/passport/index.js
/passport/localStrategy.js
/controllers/auth.js)
메인페이지: 
로그인 기능 /controllers/auth.js
passport 모듈을 사용


회원가입: /controllers/auth.js
employer
employee

아이디, 비밀번호, 그리고 employer인지 employee인지 를 입력하여 회원가입.

<Express 사용>




곳곳에서 express 모듈 사용 자세한 내용은 app.js확인
<Rest ApI 사용>
(/routes/*)




rest API를 사용하였으며 , 라우터 모듈을 활용하여 각각의 라우터 따로 정의
자세한 내용은 /routes 디렉터리 밑에서 확인 가능



2024 웹응용 프로그래밍 텀프로젝트로 진행됨.

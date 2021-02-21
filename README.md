# c_slack

Tech Stack
front-end : React, SWR(https://swr.vercel.app/)
back-end: Nest.js, typeORM(MySQL)

프론트에서는 리덕스 없이 상태 관리하는법
백엔드에서는 nest와 typeORM 활용법을 익힌다.

front-end 파트제작시 필요한 벡엔드 구동법

$cd back
$npm i

back 폴더에 .env 생성후
COOKIE_SECRET=sleactcookie
MYSQL_PASSWORD=rbgksla
작성

$npx sequelize db:create

$npm run dev //DB연결 성공 확인

$npx sequelize db:seed:all

$npm run dev

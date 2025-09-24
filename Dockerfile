# 간단한 React 앱 배포용 Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 정적 파일 서빙을 위한 serve 설치
RUN npm install -g serve

# 포트 노출
EXPOSE $PORT

# 앱 실행
CMD serve -s build -l $PORT
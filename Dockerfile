# 가장 간단한 React 앱 배포
FROM node:18-alpine

WORKDIR /app

# package.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY public/ ./public/
COPY src/ ./src/

# 빌드
RUN npm run build

# serve 설치 및 실행
RUN npm install -g serve

# 포트 설정
EXPOSE $PORT

# 앱 실행
CMD ["sh", "-c", "serve -s build -l $PORT"]
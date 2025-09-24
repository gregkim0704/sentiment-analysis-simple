# 멀티 스테이지 빌드: 프론트엔드 + 백엔드 통합

# Stage 1: 프론트엔드 빌드
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Stage 2: 백엔드 + 프론트엔드 서빙
FROM python:3.11-slim

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# Python 의존성 설치
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 코드 복사
COPY backend/ ./

# 프론트엔드 빌드 결과물 복사
COPY --from=frontend-build /app/frontend/build ./build

# 포트 노출
EXPOSE $PORT

# 애플리케이션 실행
CMD ["python", "main.py"]
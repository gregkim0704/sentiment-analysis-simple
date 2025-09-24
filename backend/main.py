from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import random
import time
from typing import List, Dict
import os
from pathlib import Path

app = FastAPI(title="센티멘트 분석 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 (React 빌드 파일)
static_dir = Path(__file__).parent.parent / "build"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 데이터 모델
class TextAnalysisRequest(BaseModel):
    text: str
    stakeholder_type: str = "general"

class SentimentResult(BaseModel):
    text: str
    sentiment: str
    confidence: float
    stakeholder_type: str
    keywords: List[str]

class StakeholderData(BaseModel):
    name: str
    sentiment: str
    score: int
    trend: str
    recent_mentions: int

# 가상 데이터베이스 (실제로는 PostgreSQL 사용)
fake_db = {
    "sentiment_history": [],
    "stakeholder_data": [
        {"name": "고객", "sentiment": "positive", "score": 78, "trend": "up", "recent_mentions": 245},
        {"name": "투자자", "sentiment": "neutral", "score": 52, "trend": "down", "recent_mentions": 89},
        {"name": "직원", "sentiment": "positive", "score": 85, "trend": "up", "recent_mentions": 156},
        {"name": "언론", "sentiment": "negative", "score": 35, "trend": "down", "recent_mentions": 78},
        {"name": "정부", "sentiment": "neutral", "score": 60, "trend": "stable", "recent_mentions": 34},
        {"name": "파트너", "sentiment": "positive", "score": 72, "trend": "up", "recent_mentions": 67}
    ]
}

# 한국어 키워드 사전
POSITIVE_KEYWORDS = ["좋다", "훌륭하다", "만족", "추천", "성공", "발전", "개선", "효과적", "우수"]
NEGATIVE_KEYWORDS = ["나쁘다", "실망", "문제", "불만", "실패", "악화", "부족", "비효율", "우려"]
NEUTRAL_KEYWORDS = ["보통", "일반적", "평균", "표준", "기본", "중간", "적당", "무난"]

def analyze_sentiment(text: str) -> tuple:
    """간단한 한국어 센티멘트 분석"""
    text_lower = text.lower()
    
    positive_count = sum(1 for word in POSITIVE_KEYWORDS if word in text_lower)
    negative_count = sum(1 for word in NEGATIVE_KEYWORDS if word in text_lower)
    neutral_count = sum(1 for word in NEUTRAL_KEYWORDS if word in text_lower)
    
    # 키워드 추출
    found_keywords = []
    for word in POSITIVE_KEYWORDS + NEGATIVE_KEYWORDS + NEUTRAL_KEYWORDS:
        if word in text_lower:
            found_keywords.append(word)
    
    # 센티멘트 결정
    if positive_count > negative_count and positive_count > neutral_count:
        sentiment = "positive"
        confidence = min(0.9, 0.6 + (positive_count * 0.1))
    elif negative_count > positive_count and negative_count > neutral_count:
        sentiment = "negative"
        confidence = min(0.9, 0.6 + (negative_count * 0.1))
    else:
        sentiment = "neutral"
        confidence = 0.5 + random.uniform(0, 0.3)
    
    return sentiment, confidence, found_keywords[:5]  # 최대 5개 키워드

# API 엔드포인트들

@app.get("/")
async def root():
    return {"message": "센티멘트 분석 API 서버가 실행 중입니다"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/api/analyze", response_model=SentimentResult)
async def analyze_text(request: TextAnalysisRequest):
    """텍스트 센티멘트 분석"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="텍스트가 비어있습니다")
    
    sentiment, confidence, keywords = analyze_sentiment(request.text)
    
    result = SentimentResult(
        text=request.text,
        sentiment=sentiment,
        confidence=round(confidence, 2),
        stakeholder_type=request.stakeholder_type,
        keywords=keywords
    )
    
    # 가상 DB에 저장
    fake_db["sentiment_history"].append({
        "timestamp": time.time(),
        "result": result.dict()
    })
    
    return result

@app.get("/api/stakeholders")
async def get_stakeholders():
    """스테이크홀더 데이터 조회"""
    # 실시간 변화 시뮬레이션
    for stakeholder in fake_db["stakeholder_data"]:
        # 점수를 약간씩 변경
        change = random.randint(-3, 3)
        stakeholder["score"] = max(0, min(100, stakeholder["score"] + change))
        
        # 트렌드 업데이트
        if change > 0:
            stakeholder["trend"] = "up"
        elif change < 0:
            stakeholder["trend"] = "down"
        else:
            stakeholder["trend"] = "stable"
    
    return {"stakeholders": fake_db["stakeholder_data"]}

@app.get("/api/sentiment-summary")
async def get_sentiment_summary():
    """전체 센티멘트 요약"""
    # 최근 분석 결과 기반으로 요약 생성
    recent_analyses = fake_db["sentiment_history"][-50:]  # 최근 50개
    
    if not recent_analyses:
        # 기본값
        return {
            "positive": 65,
            "neutral": 25,
            "negative": 10,
            "total_analyses": 0
        }
    
    positive_count = sum(1 for analysis in recent_analyses 
                        if analysis["result"]["sentiment"] == "positive")
    negative_count = sum(1 for analysis in recent_analyses 
                        if analysis["result"]["sentiment"] == "negative")
    neutral_count = len(recent_analyses) - positive_count - negative_count
    
    total = len(recent_analyses)
    
    return {
        "positive": round((positive_count / total) * 100) if total > 0 else 65,
        "neutral": round((neutral_count / total) * 100) if total > 0 else 25,
        "negative": round((negative_count / total) * 100) if total > 0 else 10,
        "total_analyses": total
    }

@app.get("/api/recent-analyses")
async def get_recent_analyses():
    """최근 분석 결과 조회"""
    recent = fake_db["sentiment_history"][-10:]  # 최근 10개
    return {"analyses": recent}

# React 앱 서빙 (SPA 라우팅)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """React 앱 서빙"""
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # 정적 파일 확인
    static_file_path = static_dir / full_path
    if static_file_path.is_file():
        return FileResponse(static_file_path)
    
    # SPA 라우팅을 위해 index.html 반환
    index_path = static_dir / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
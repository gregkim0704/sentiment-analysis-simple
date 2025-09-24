import React, { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sentimentData, setSentimentData] = useState({
    positive: 65,
    neutral: 25,
    negative: 10,
    total_analyses: 0
  });
  const [stakeholders, setStakeholders] = useState([]);
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // API 기본 URL
  const API_BASE = window.location.origin;

  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 데이터 로딩
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // 센티멘트 요약 데이터 로드
      const summaryResponse = await fetch(`${API_BASE}/api/sentiment-summary`);
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSentimentData(summaryData);
      }

      // 스테이크홀더 데이터 로드
      const stakeholdersResponse = await fetch(`${API_BASE}/api/stakeholders`);
      if (stakeholdersResponse.ok) {
        const stakeholdersData = await stakeholdersResponse.json();
        setStakeholders(stakeholdersData.stakeholders);
      }

      // 최근 분석 결과 로드
      const recentResponse = await fetch(`${API_BASE}/api/recent-analyses`);
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentAnalyses(recentData.analyses);
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  const analyzeText = async () => {
    if (!analysisText.trim()) {
      alert('분석할 텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: analysisText,
          stakeholder_type: 'general'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
        setAnalysisText('');
        // 데이터 새로고침
        setTimeout(loadData, 1000);
      } else {
        alert('분석 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('분석 실패:', error);
      alert('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getSentimentText = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '긍정적';
      case 'negative': return '부정적';
      default: return '중립적';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* 헤더 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#1976d2', fontSize: '2.5rem', marginBottom: '10px' }}>
          📊 센티멘트 분석 플랫폼
        </h1>
        <h2 style={{ color: '#666', fontSize: '1.2rem', marginBottom: '20px' }}>
          실시간 멀티 스테이크홀더 센티멘트 분석 시스템
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          실시간 업데이트: {currentTime.toLocaleString('ko-KR')}
        </p>
        <p style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '10px' }}>
          ✅ 실제 API 연동 | 총 {sentimentData.total_analyses}건 분석 완료
        </p>
      </div>

      {/* 텍스트 분석 섹션 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 텍스트 센티멘트 분석</h3>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            placeholder="분석할 텍스트를 입력하세요... (예: 이 제품은 정말 좋습니다. 만족스러워요!)"
            style={{
              width: '100%',
              height: '100px',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <button
          onClick={analyzeText}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '분석 중...' : '센티멘트 분석'}
        </button>

        {/* 분석 결과 */}
        {analysisResult && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: `3px solid ${getSentimentColor(analysisResult.sentiment)}`
          }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>📋 분석 결과</h4>
            <div style={{ marginBottom: '10px' }}>
              <strong>센티멘트:</strong> 
              <span style={{ 
                color: getSentimentColor(analysisResult.sentiment),
                fontWeight: 'bold',
                marginLeft: '10px'
              }}>
                {getSentimentText(analysisResult.sentiment)} ({Math.round(analysisResult.confidence * 100)}% 확신)
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>분석 텍스트:</strong> "{analysisResult.text}"
            </div>
            {analysisResult.keywords.length > 0 && (
              <div>
                <strong>주요 키워드:</strong> 
                {analysisResult.keywords.map((keyword, index) => (
                  <span key={index} style={{
                    backgroundColor: getSentimentColor(analysisResult.sentiment),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginLeft: '5px'
                  }}>
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 대시보드 그리드 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* 전체 센티멘트 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>📈 전체 센티멘트</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>긍정적</span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{sentimentData.positive}%</span>
            </div>
            <div style={{ 
              backgroundColor: '#e0e0e0', 
              height: '8px', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#4caf50', 
                height: '100%', 
                width: `${sentimentData.positive}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>중립적</span>
              <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{sentimentData.neutral}%</span>
            </div>
            <div style={{ 
              backgroundColor: '#e0e0e0', 
              height: '8px', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#ff9800', 
                height: '100%', 
                width: `${sentimentData.neutral}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>부정적</span>
              <span style={{ color: '#f44336', fontWeight: 'bold' }}>{sentimentData.negative}%</span>
            </div>
            <div style={{ 
              backgroundColor: '#e0e0e0', 
              height: '8px', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#f44336', 
                height: '100%', 
                width: `${sentimentData.negative}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* 기술 스택 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>🛠️ 기술 스택</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>프론트엔드:</strong> React + JavaScript
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>백엔드:</strong> FastAPI + Python
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>배포:</strong> Railway 클라우드
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>AI/ML:</strong> 한국어 센티멘트 분석
          </div>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            <small style={{ color: '#2e7d32' }}>✅ 실시간 API 연동 완료</small>
          </div>
        </div>
      </div>

      {/* 스테이크홀더 분석 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>👥 스테이크홀더별 센티멘트 (실시간)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px'
        }}>
          {stakeholders.map((stakeholder, index) => (
            <div key={index} style={{ 
              padding: '15px', 
              border: `2px solid ${getSentimentColor(stakeholder.sentiment)}`,
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: `${getSentimentColor(stakeholder.sentiment)}10`
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {stakeholder.name} {getTrendIcon(stakeholder.trend)}
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: getSentimentColor(stakeholder.sentiment)
              }}>
                {stakeholder.score}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>
                센티멘트 점수
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                최근 언급: {stakeholder.recent_mentions}건
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 분석 결과 */}
      {recentAnalyses.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>📝 최근 분석 결과</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentAnalyses.slice().reverse().map((analysis, index) => (
              <div key={index} style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${getSentimentColor(analysis.result.sentiment)}`
              }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>
                  {new Date(analysis.timestamp * 1000).toLocaleString('ko-KR')}
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>텍스트:</strong> "{analysis.result.text}"
                </div>
                <div>
                  <strong>결과:</strong> 
                  <span style={{ 
                    color: getSentimentColor(analysis.result.sentiment),
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {getSentimentText(analysis.result.sentiment)} ({Math.round(analysis.result.confidence * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 배포 성공 메시지 */}
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '25px', 
        borderRadius: '15px',
        border: '2px solid #4caf50',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>🚀 실제 기능 구현 완료!</h3>
        <p style={{ color: '#2e7d32', marginBottom: '15px' }}>
          풀스택 센티멘트 분석 플랫폼이 실제 API와 함께 배포되었습니다.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ color: '#2e7d32' }}>✅ 실시간 텍스트 분석</div>
          <div style={{ color: '#2e7d32' }}>✅ 한국어 키워드 인식</div>
          <div style={{ color: '#2e7d32' }}>✅ 스테이크홀더 추적</div>
          <div style={{ color: '#2e7d32' }}>✅ 분석 히스토리</div>
        </div>
      </div>
    </div>
  );
}

export default App;
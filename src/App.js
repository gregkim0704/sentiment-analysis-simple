import React, { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 간단한 로컬 센티멘트 분석 (API 없이)
  const analyzeTextLocally = () => {
    if (!analysisText.trim()) {
      alert('분석할 텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    // 간단한 키워드 기반 분석
    const text = analysisText.toLowerCase();
    const positiveWords = ['좋다', '훌륭하다', '만족', '추천', '성공', '좋아요', '최고'];
    const negativeWords = ['나쁘다', '실망', '문제', '불만', '실패', '싫어요', '최악'];
    
    let sentiment = 'neutral';
    let confidence = 0.5;
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = 0.7 + (positiveCount * 0.1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = 0.7 + (negativeCount * 0.1);
    }
    
    // 1초 후 결과 표시 (로딩 시뮬레이션)
    setTimeout(() => {
      setAnalysisResult({
        text: analysisText,
        sentiment: sentiment,
        confidence: Math.min(confidence, 0.95),
        keywords: [...positiveWords, ...negativeWords].filter(word => text.includes(word)).slice(0, 3)
      });
      setIsLoading(false);
    }, 1000);
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

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
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
          실시간 텍스트 감정 분석 시스템
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          현재 시간: {currentTime.toLocaleString('ko-KR')}
        </p>
      </div>

      {/* 텍스트 분석 섹션 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 텍스트 센티멘트 분석</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            분석할 텍스트를 입력하세요:
          </label>
          <textarea
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            placeholder="예: 이 제품은 정말 좋습니다! 만족스러워요!"
            style={{
              width: '100%',
              height: '120px',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          onClick={analyzeTextLocally}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {isLoading ? '분석 중...' : '📊 센티멘트 분석 시작'}
        </button>

        {/* 분석 결과 */}
        {analysisResult && (
          <div style={{
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            border: `3px solid ${getSentimentColor(analysisResult.sentiment)}`
          }}>
            <h4 style={{ color: '#333', marginBottom: '20px', fontSize: '1.3rem' }}>
              📋 분석 결과
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gap: '15px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }}>
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  센티멘트
                </div>
                <div style={{ 
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: getSentimentColor(analysisResult.sentiment)
                }}>
                  {getSentimentText(analysisResult.sentiment)}
                </div>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  신뢰도
                </div>
                <div style={{ 
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: getSentimentColor(analysisResult.sentiment)
                }}>
                  {Math.round(analysisResult.confidence * 100)}%
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                <strong>분석된 텍스트:</strong>
              </div>
              <div style={{ 
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontStyle: 'italic'
              }}>
                "{analysisResult.text}"
              </div>
            </div>
            
            {analysisResult.keywords.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                  <strong>감지된 키워드:</strong>
                </div>
                <div>
                  {analysisResult.keywords.map((keyword, index) => (
                    <span key={index} style={{
                      backgroundColor: getSentimentColor(analysisResult.sentiment),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      marginRight: '8px',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 사용 예시 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>💡 사용 예시</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
            <strong style={{ color: '#2e7d32' }}>긍정적 예시:</strong><br/>
            "이 제품은 정말 좋습니다! 추천해요!"
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
            <strong style={{ color: '#f57c00' }}>중립적 예시:</strong><br/>
            "보통입니다. 평균적인 수준이에요."
          </div>
          <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            <strong style={{ color: '#d32f2f' }}>부정적 예시:</strong><br/>
            "서비스가 별로네요. 실망스럽습니다."
          </div>
        </div>
      </div>

      {/* 기술 정보 */}
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '25px', 
        borderRadius: '15px',
        border: '2px solid #4caf50',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>🚀 배포 성공!</h3>
        <p style={{ color: '#2e7d32', marginBottom: '15px' }}>
          센티멘트 분석 플랫폼이 Railway에 성공적으로 배포되었습니다.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          flexWrap: 'wrap',
          fontSize: '0.9rem'
        }}>
          <div style={{ color: '#2e7d32' }}>✅ React 프론트엔드</div>
          <div style={{ color: '#2e7d32' }}>✅ 로컬 텍스트 분석</div>
          <div style={{ color: '#2e7d32' }}>✅ 반응형 디자인</div>
          <div style={{ color: '#2e7d32' }}>✅ 실시간 결과</div>
        </div>
      </div>
    </div>
  );
}

export default App;
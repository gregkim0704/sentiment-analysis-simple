import React, { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sentimentData, setSentimentData] = useState({
    positive: 65,
    neutral: 25,
    negative: 10
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stakeholders = [
    { name: '고객', sentiment: 'positive', score: 78 },
    { name: '투자자', sentiment: 'neutral', score: 52 },
    { name: '직원', sentiment: 'positive', score: 85 },
    { name: '언론', sentiment: 'negative', score: 35 },
    { name: '정부', sentiment: 'neutral', score: 60 },
    { name: '파트너', sentiment: 'positive', score: 72 }
  ];

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      default: return '#ff9800';
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
          멀티 스테이크홀더 센티멘트 분석 시스템
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          실시간 업데이트: {currentTime.toLocaleString('ko-KR')}
        </p>
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
            <strong>AI/ML:</strong> 센티멘트 분석 모델
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
        <h3 style={{ color: '#333', marginBottom: '20px' }}>👥 스테이크홀더별 센티멘트</h3>
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
                {stakeholder.name}
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: getSentimentColor(stakeholder.sentiment)
              }}>
                {stakeholder.score}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                센티멘트 점수
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배포 성공 메시지 */}
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '25px', 
        borderRadius: '15px',
        border: '2px solid #4caf50',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>🚀 배포 성공!</h3>
        <p style={{ color: '#2e7d32', marginBottom: '15px' }}>
          풀스택 센티멘트 분석 플랫폼이 성공적으로 배포되었습니다.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ color: '#2e7d32' }}>✅ 실시간 데이터</div>
          <div style={{ color: '#2e7d32' }}>✅ 반응형 디자인</div>
          <div style={{ color: '#2e7d32' }}>✅ 다중 스테이크홀더</div>
        </div>
      </div>
    </div>
  );
}

export default App;
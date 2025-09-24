import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#1976d2', fontSize: '3rem', marginBottom: '20px' }}>
        🎉 센티멘트 분석 플랫폼
      </h1>
      
      <h2 style={{ color: '#666', fontSize: '1.5rem', marginBottom: '40px' }}>
        멀티 스테이크홀더 센티멘트 분석 시스템
      </h2>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '30px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>✅ 기술 스택</h3>
        <p>프론트엔드: React + JavaScript</p>
        <p>백엔드: FastAPI + Python</p>
        <p>배포: Railway 클라우드</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '20px', 
        borderRadius: '10px',
        border: '2px solid #4caf50'
      }}>
        <h3 style={{ color: '#2e7d32' }}>🚀 배포 성공!</h3>
        <p style={{ color: '#2e7d32' }}>
          풀스택 애플리케이션이 성공적으로 배포되었습니다.
        </p>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const analyze = () => {
    if (!text) {
      setResult('텍스트를 입력해주세요!');
      return;
    }

    // 간단한 분석
    if (text.includes('좋') || text.includes('만족') || text.includes('추천')) {
      setResult('😊 긍정적');
    } else if (text.includes('나쁘') || text.includes('실망') || text.includes('별로')) {
      setResult('😞 부정적');
    } else {
      setResult('😐 중립적');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📊 센티멘트 분석</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트를 입력하세요..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            fontSize: '16px'
          }}
        />
      </div>
      
      <button 
        onClick={analyze}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        분석하기
      </button>
      
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '5px'
        }}>
          <h3>결과: {result}</h3>
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p>✅ React 앱이 정상적으로 작동 중입니다!</p>
        <p>🚀 Railway 배포 성공!</p>
      </div>
    </div>
  );
}

export default App;
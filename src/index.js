import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('React 앱 시작!');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('React 앱 렌더링 완료!');
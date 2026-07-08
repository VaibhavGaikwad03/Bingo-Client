import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketProvider } from './context/WebSocketContext';
import App from './App';
import './css/index.css';
import './css/auth.css';
import './css/chat.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </BrowserRouter>
);

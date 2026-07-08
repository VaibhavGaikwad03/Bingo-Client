import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWS } from './context/WebSocketContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatLayout from './pages/ChatLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RequireAuth({ children }) {
  const { isAuth } = useWS();
  return isAuth ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatLayout />
            </RequireAuth>
          }
        />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          background: 'rgba(20, 20, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: '12px',
        }}
      />
    </>
  );
}

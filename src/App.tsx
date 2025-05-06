import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import SavedReplies from './pages/SavedReplies';
import Login from './pages/Login';
import ReplyYoutubePage from './pages/reply/ReplyYoutubePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/saved" element={
              <AuthGuard>
                <SavedReplies />
              </AuthGuard>
            } />
            <Route path="/reply/youtube" element={
              <AuthGuard>
                <ReplyYoutubePage />
              </AuthGuard>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
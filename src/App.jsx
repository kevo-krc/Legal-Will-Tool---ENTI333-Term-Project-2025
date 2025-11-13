import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateWill from './pages/CreateWill';
import Questionnaire from './pages/Questionnaire';
import WillSummary from './pages/WillSummary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { toasts, removeToast } = useNotifications();
  
  return (
    <div className="app">
      <Header />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-will" element={
            <ProtectedRoute>
              <CreateWill />
            </ProtectedRoute>
          } />
          <Route path="/questionnaire/:willId" element={
            <ProtectedRoute>
              <Questionnaire />
            </ProtectedRoute>
          } />
          <Route path="/will-summary/:willId" element={
            <ProtectedRoute>
              <WillSummary />
            </ProtectedRoute>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

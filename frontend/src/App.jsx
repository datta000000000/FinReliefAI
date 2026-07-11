import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import Profile from './pages/Profile';
import Health from './pages/Health';
import Settlement from './pages/Settlement';
import Negotiation from './pages/Negotiation';
import Letter from './pages/Letter';
import AIHistory from './pages/AIHistory';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Landing route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <Layout>
                  <Loans />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <Layout>
                  <Health />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settlement"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settlement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/negotiation"
            element={
              <ProtectedRoute>
                <Layout>
                  <Negotiation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/letter"
            element={
              <ProtectedRoute>
                <Layout>
                  <Letter />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <AIHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;

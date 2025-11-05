import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import StudyCircleDashboard from './pages/Dashboard'
import StudyGroupSession from './pages/StudySection'
import ProfileSection from './pages/ProfileSection'
import SignupPage from './pages/Signup'
import TextSessionCreation from './pages/SessionCreation'
import Textsession from './pages/textsession'
import SessionTypeSelection from './pages/SessionCreation'

// Simple route protection component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/signuppage' element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <StudyCircleDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/GroupSession" 
            element={
              <ProtectedRoute>
                <StudyGroupSession />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ProfileSection" 
            element={
              <ProtectedRoute>
                <ProfileSection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/TextSessionCreation" 
            element={
              <ProtectedRoute>
                <TextSessionCreation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/TextSession" 
            element={
              <ProtectedRoute>
                <Textsession />
              </ProtectedRoute>
            } 
          />
          {/* Add the new route */}
          <Route 
            path="/SessionTypeSelection" 
            element={
              <ProtectedRoute>
                <SessionTypeSelection />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
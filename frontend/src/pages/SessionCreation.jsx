// SessionTypeSelection.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SessionTypeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from location state or localStorage
  const user = location.state?.user || JSON.parse(localStorage.getItem('user'));

  const handleVideoSession = () => {
    window.location.href = 'https://comsatsconnect.vercel.app/';
  };

  const handleTextSession = () => {
    // Pass user data to TextSession
    navigate('/TextSession', { state: { user } });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Session</h1>
          <p className="text-gray-400">Choose your session type</p>
          {user && (
            <p className="text-blue-400 text-sm mt-2">Logged in as: {user.fullName}</p>
          )}
        </div>

        {/* Session Type Options */}
        <div className="space-y-4 mb-6">
          {/* Video Session Option */}
          <button
            onClick={handleVideoSession}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-6 text-left hover:bg-gray-600 transition-colors duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Video Session</h3>
                <p className="text-gray-400 text-sm">Real-time video calls with screen sharing</p>
              </div>
            </div>
          </button>

          {/* Text Session Option */}
          <button
            onClick={handleTextSession}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-6 text-left hover:bg-gray-600 transition-colors duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Text Session</h3>
                <p className="text-gray-400 text-sm">Text-based collaboration and chat</p>
              </div>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTypeSelection;
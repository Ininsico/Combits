// TextSession.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TextSession = () => {
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [participants, setParticipants] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [user, setUser] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Load session data from location state or create new
        if (location.state?.session) {
            setSession(location.state.session);
            initializeSession(location.state.session);
        }
    }, [location]);

    const initializeSession = (sessionData) => {
        // Fetch session details, messages, participants, etc. from API
        fetchSessionData(sessionData.id);
    };

    const fetchSessionData = async (sessionId) => {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`);
            const data = await response.json();
            if (data.success) {
                setSession(data.data.session);
                setMessages(data.data.messages || []);
                setParticipants(data.data.participants || []);
                setAttendance(data.data.attendance || []);
                setQuestions(data.data.questions || []);
            }
        } catch (error) {
            console.error('Error fetching session data:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('/api/sessions/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.id,
                    text: newMessage,
                    type: 'message'
                })
            });

            if (response.ok) {
                setNewMessage('');
                // Refresh messages
                fetchSessionData(session.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleAskQuestion = async () => {
        if (!newQuestion.trim()) return;

        try {
            const response = await fetch('/api/sessions/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.id,
                    question: newQuestion
                })
            });

            if (response.ok) {
                setNewQuestion('');
                fetchSessionData(session.id);
            }
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

    const handleMarkAttendance = async (status) => {
        try {
            const response = await fetch('/api/sessions/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.id,
                    status: status
                })
            });

            if (response.ok) {
                fetchSessionData(session.id);
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    const handleJoinWithCode = async () => {
        try {
            const response = await fetch('/api/sessions/join-with-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    joinCode: joinCode
                })
            });

            const data = await response.json();
            if (data.success) {
                setSession(data.data.session);
                setShowJoinModal(false);
                initializeSession(data.data.session);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    const handleVideoCall = () => {
        window.open('https://comsatsconnect.vercel.app/', '_blank');
    };

    const generateJoinLink = () => {
        return `${window.location.origin}/join-session/${session.joinCode}`;
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading session...</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{session.title}</h1>
                        <p className="text-gray-400">
                            {session.courseCode} • {session.department} • {session.participants.length}/{session.maxParticipants} participants
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        {session.isPrivate && (
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Invite
                            </button>
                        )}
                        <button
                            onClick={handleVideoCall}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Video Call
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex h-screen pt-16">
                {/* Sidebar */}
                <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">Session Info</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Time:</span>
                                <p>{session.time}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Location:</span>
                                <p>{session.location}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Course:</span>
                                <p>{session.courseCode}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Department:</span>
                                <p>{session.department}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">Attendance</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleMarkAttendance('present')}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Present
                            </button>
                            <button
                                onClick={() => handleMarkAttendance('absent')}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Absent
                            </button>
                        </div>
                        <div className="mt-3 text-sm">
                            <p>Present: {attendance.filter(a => a.status === 'present').length}</p>
                            <p>Absent: {attendance.filter(a => a.status === 'absent').length}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3">Participants ({participants.length})</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {participants.map(participant => (
                                <div key={participant.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                                    <img
                                        src={participant.avatar || '/DefaultPic.png'}
                                        alt={participant.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm">{participant.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Tabs */}
                    <div className="bg-gray-800 border-b border-gray-700">
                        <div className="flex">
                            {['chat', 'questions', 'description'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 font-semibold capitalize ${
                                        activeTab === tab 
                                            ? 'border-b-2 border-blue-500 text-blue-500' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {activeTab === 'chat' && (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                                    {messages.map(message => (
                                        <div key={message.id} className="flex space-x-3">
                                            <img
                                                src={message.user.avatar || '/DefaultPic.png'}
                                                alt={message.user.name}
                                                className="w-8 h-8 rounded-full flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="font-bold">{message.user.name}</span>
                                                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                                                </div>
                                                <p className="text-gray-300">{message.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'questions' && (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                                    {questions.map(question => (
                                        <div key={question.id} className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <img
                                                        src={question.user.avatar || '/DefaultPic.png'}
                                                        alt={question.user.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <span className="font-bold">{question.user.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">{question.timestamp}</span>
                                            </div>
                                            <p className="text-gray-300 mb-3">{question.text}</p>
                                            <div className="space-y-2">
                                                {question.answers?.map(answer => (
                                                    <div key={answer.id} className="ml-6 border-l-2 border-gray-600 pl-3">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <img
                                                                src={answer.user.avatar || '/DefaultPic.png'}
                                                                alt={answer.user.name}
                                                                className="w-5 h-5 rounded-full"
                                                            />
                                                            <span className="text-sm font-bold">{answer.user.name}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-300">{answer.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="Ask a question..."
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                                    />
                                    <button
                                        onClick={handleAskQuestion}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Ask
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'description' && (
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Session Description</h3>
                                <p className="text-gray-300 leading-relaxed">{session.description}</p>
                                
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold mb-2">Meeting Schedule</h4>
                                        <p className="text-gray-300">{session.schedule}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">Requirements</h4>
                                        <p className="text-gray-300">{session.requirements}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Join Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Invite to Session</h3>
                        <p className="text-gray-400 mb-4">Share this code or link to invite others:</p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Join Code:</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={session.joinCode}
                                    readOnly
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(session.joinCode)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Join Link:</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={generateJoinLink()}
                                    readOnly
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(generateJoinLink())}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowJoinModal(false)}
                            className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextSession;
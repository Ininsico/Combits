// TextSession.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TextSession = () => {
    const [sessionForm, setSessionForm] = useState({
        title: '',
        sessionType: 'public',
        description: '',
        department: '',
        location: 'Online',
        schedule: '',
        studyTopic: '',
        courseCode: '',
        maxParticipants: 10,
        requirements: ''
    });
    const [user, setUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createdSession, setCreatedSession] = useState(null);
    const [activeField, setActiveField] = useState('');
    const [particles, setParticles] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // Generate floating particles
    useEffect(() => {
        const newParticles = [];
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 20 + 10,
                delay: Math.random() * 5
            });
        }
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        const userFromState = location.state?.user;
        const savedUser = localStorage.getItem('user');

        if (userFromState) {
            setUser(userFromState);
            setSessionForm(prev => ({
                ...prev,
                department: userFromState.department || ''
            }));
        } else if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setSessionForm(prev => ({
                ...prev,
                department: userData.department || ''
            }));
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSessionForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('User not found. Please login again.');
            return;
        }

        setIsCreating(true);
        try {
            const token = localStorage.getItem('token');

            // Validate required fields
            if (!sessionForm.title || !sessionForm.description || !sessionForm.studyTopic) {
                alert('Please fill in all required fields');
                setIsCreating(false);
                return;
            }

            const sessionPayload = {
                title: sessionForm.title,
                sessionType: sessionForm.sessionType,
                description: sessionForm.description,
                department: sessionForm.department,
                location: sessionForm.location,
                schedule: sessionForm.schedule,
                studyTopic: sessionForm.studyTopic,
                courseCode: sessionForm.courseCode,
                maxParticipants: sessionForm.maxParticipants,
                requirements: sessionForm.requirements
            };

            console.log('🚀 Creating session with payload:', sessionPayload);
            console.log('📝 User:', user);
            console.log('🔑 Token exists:', !!token);

            const response = await fetch('http://localhost:5000/api/sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sessionPayload)
            });

            console.log('📡 Response status:', response.status);

            const data = await response.json();
            console.log('📨 Response data:', data);

            if (data.success) {
                console.log('✅ Session created successfully:', data.data);
                setCreatedSession(data.data.session);
            } else {
                console.error('❌ Failed to create session:', data.message);
                alert('Failed to create session: ' + data.message);
            }
        } catch (error) {
            console.error('💥 Error creating session:', error);
            alert('Network error creating session. Please check your connection and try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const generateJoinCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleBack = () => {
        navigate('/SessionTypeSelection', { state: { user } });
    };

    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{
                        animation: 'pulse 2s infinite, spin 1s linear infinite',
                        borderRadius: '50%',
                        height: '60px',
                        width: '60px',
                        border: '3px solid transparent',
                        borderTop: '3px solid #00ffff',
                        borderRight: '3px solid #00ffff',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{
                        color: '#e0e0ff',
                        fontSize: '18px',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                    }}>Loading your epic session...</p>
                </div>
            </div>
        );
    }

    if (createdSession) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
                    `,
                    animation: 'pulseBackground 4s ease-in-out infinite'
                }}></div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    maxWidth: '500px',
                    width: '90%',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                    animation: 'slideUpBounce 0.8s ease-out'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px',
                        animation: 'successPulse 2s infinite',
                        boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
                    }}>
                        <svg style={{ width: '48px', height: '48px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '15px',
                        background: 'linear-gradient(45deg, #00ff88, #00ccff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
                    }}>SESSION CREATED!</h2>
                    <p style={{
                        color: '#e0e0ff',
                        fontSize: '1.1rem',
                        marginBottom: '25px',
                        lineHeight: '1.6'
                    }}>Your study session has been created successfully and is ready to rock!</p>
                    <div style={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        border: '2px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <p style={{
                            color: '#00ff88',
                            fontFamily: 'monospace',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            letterSpacing: '3px',
                            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                        }}>JOIN CODE: {createdSession.joinCode}</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>

                <style>
                    {`
                    @keyframes slideUpBounce {
                        0% { transform: translateY(100px); opacity: 0; }
                        70% { transform: translateY(-10px); opacity: 1; }
                        100% { transform: translateY(0); opacity: 1; }
                    }
                    
                    @keyframes successPulse {
                        0% { transform: scale(1); box-shadow: 0 0 30px rgba(0, 255, 136, 0.5); }
                        50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(0, 255, 136, 0.8); }
                        100% { transform: scale(1); box-shadow: 0 0 30px rgba(0, 255, 136, 0.5); }
                    }
                    
                    @keyframes pulseBackground {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            color: 'white',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                    radial-gradient(circle at 10% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 90% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
                `,
                animation: 'backgroundShift 20s ease-in-out infinite'
            }}></div>

            {/* Floating Particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    style={{
                        position: 'absolute',
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        animation: `float ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`
                    }}
                />
            ))}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Header */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    animation: 'slideDown 0.8s ease-out'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #00ff88, #00ccff, #ff6b6b)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '10px',
                                textShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
                            }}>CREATE EPIC SESSION</h1>
                            <p style={{
                                color: '#e0e0ff',
                                fontSize: '1.2rem',
                                marginBottom: '15px'
                            }}>Build your ultimate study session that will blow minds</p>
                            {user && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#00ff88',
                                        borderRadius: '50%',
                                        animation: 'pulse 2s infinite'
                                    }}></div>
                                    <p style={{
                                        color: '#00ff88',
                                        fontSize: '1rem',
                                        fontWeight: 'bold'
                                    }}>
                                        Creating as: {user.fullName} • {user.department || 'No department'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleBack}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 'bold',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateX(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.transform = 'translateX(0)';
                            }}
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {/* Session Creation Form */}
                <form onSubmit={handleCreateSession} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
                    animation: 'slideUp 0.8s ease-out 0.2s both'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '25px'
                    }}>
                        {/* Session Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>SESSION TITLE *</label>
                            <input
                                type="text"
                                name="title"
                                value={sessionForm.title}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('title')}
                                onBlur={() => setActiveField('')}
                                required
                                style={{
                                    width: '100%',
                                    background: activeField === 'title' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'title' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'title' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="Enter your epic session title..."
                            />
                        </div>

                        {/* Session Type */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>SESSION TYPE *</label>
                            <select
                                name="sessionType"
                                value={sessionForm.sessionType}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('sessionType')}
                                onBlur={() => setActiveField('')}
                                style={{
                                    width: '100%',
                                    background: activeField === 'sessionType' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'sessionType' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'sessionType' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                            >
                                <option value="public">🌍 Public Session</option>
                                <option value="private">🔒 Private Session</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>DEPARTMENT *</label>
                            <input
                                type="text"
                                name="department"
                                value={sessionForm.department}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('department')}
                                onBlur={() => setActiveField('')}
                                required
                                style={{
                                    width: '100%',
                                    background: activeField === 'department' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'department' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'department' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="Your department..."
                            />
                        </div>

                        {/* Course Code */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>COURSE CODE</label>
                            <input
                                type="text"
                                name="courseCode"
                                value={sessionForm.courseCode}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('courseCode')}
                                onBlur={() => setActiveField('')}
                                style={{
                                    width: '100%',
                                    background: activeField === 'courseCode' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'courseCode' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'courseCode' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="e.g., CS101, MATH202"
                            />
                        </div>

                        {/* Study Topic */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>STUDY TOPIC *</label>
                            <input
                                type="text"
                                name="studyTopic"
                                value={sessionForm.studyTopic}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('studyTopic')}
                                onBlur={() => setActiveField('')}
                                required
                                style={{
                                    width: '100%',
                                    background: activeField === 'studyTopic' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'studyTopic' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'studyTopic' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="What are you studying?"
                            />
                        </div>

                        {/* Max Participants */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>MAX PARTICIPANTS *</label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={sessionForm.maxParticipants}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('maxParticipants')}
                                onBlur={() => setActiveField('')}
                                min="2"
                                max="50"
                                required
                                style={{
                                    width: '100%',
                                    background: activeField === 'maxParticipants' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'maxParticipants' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'maxParticipants' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>LOCATION *</label>
                            <select
                                name="location"
                                value={sessionForm.location}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('location')}
                                onBlur={() => setActiveField('')}
                                style={{
                                    width: '100%',
                                    background: activeField === 'location' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'location' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'location' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                            >
                                <option value="Online">🌐 Online</option>
                                <option value="Library">📚 Library</option>
                                <option value="Classroom">🏫 Classroom</option>
                                <option value="Cafe">☕ Cafe</option>
                                <option value="Other">📍 Other</option>
                            </select>
                        </div>

                        {/* Schedule */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>SCHEDULE *</label>
                            <select
                                name="schedule"
                                value={sessionForm.schedule}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('schedule')}
                                onBlur={() => setActiveField('')}
                                required
                                style={{
                                    width: '100%',
                                    background: activeField === 'schedule' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'schedule' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: activeField === 'schedule' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                            >
                                <option value="">Select Schedule</option>
                                <option value="One-time session">⚡ One-time session</option>
                                <option value="Weekly sessions">📅 Weekly sessions</option>
                                <option value="Bi-weekly sessions">🔄 Bi-weekly sessions</option>
                                <option value="Daily sessions">🌞 Daily sessions</option>
                                <option value="Monthly sessions">📆 Monthly sessions</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>DESCRIPTION *</label>
                            <textarea
                                name="description"
                                value={sessionForm.description}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('description')}
                                onBlur={() => setActiveField('')}
                                required
                                rows="4"
                                style={{
                                    width: '100%',
                                    background: activeField === 'description' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'description' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    resize: 'vertical',
                                    minHeight: '120px',
                                    boxShadow: activeField === 'description' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="Describe your epic study session goals, topics, and what makes it awesome..."
                            />
                        </div>

                        {/* Requirements */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                color: 'white',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>REQUIREMENTS</label>
                            <textarea
                                name="requirements"
                                value={sessionForm.requirements}
                                onChange={handleInputChange}
                                onFocus={() => setActiveField('requirements')}
                                onBlur={() => setActiveField('')}
                                rows="2"
                                style={{
                                    width: '100%',
                                    background: activeField === 'requirements' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                    border: activeField === 'requirements' ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    resize: 'vertical',
                                    minHeight: '80px',
                                    boxShadow: activeField === 'requirements' ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                                }}
                                placeholder="Any special requirements? (laptop, textbook, completed assignments...)"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginTop: '40px',
                        paddingTop: '30px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                flex: 1,
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '18px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            style={{
                                flex: 2,
                                background: isCreating
                                    ? 'linear-gradient(45deg, #667eea, #764ba2)'
                                    : 'linear-gradient(45deg, #00ff88, #00ccff)',
                                color: 'white',
                                padding: '18px',
                                borderRadius: '15px',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: isCreating ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                opacity: isCreating ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isCreating) {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 40px rgba(0, 255, 136, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isCreating) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {isCreating ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        animation: 'spin 1s linear infinite',
                                        borderRadius: '50%',
                                        height: '20px',
                                        width: '20px',
                                        border: '2px solid transparent',
                                        borderTop: '2px solid white',
                                        borderRight: '2px solid white'
                                    }}></div>
                                    CREATING EPIC SESSION...
                                </div>
                            ) : (
                                '🚀 CREATE EPIC SESSION'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Global Styles */}
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes slideDown {
                    0% { transform: translateY(-50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideUp {
                    0% { transform: translateY(50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes backgroundShift {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #00ff88, #00ccff);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #00ccff, #00ff88);
                }
                
                /* Input placeholder color */
                ::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                
                /* Selection color */
                ::selection {
                    background: rgba(0, 255, 136, 0.3);
                    color: white;
                }
                `}
            </style>
        </div>
    );
};

export default TextSession;
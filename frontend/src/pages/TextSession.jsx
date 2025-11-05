// TextSession.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const TextSession = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        sessionType: 'public',
        description: '',
        department: '',
        location: '',
        schedule: '',
        studyTopic: '',
        courseCode: '',
        maxParticipants: 10,
        requirements: ''
    });

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please log in first');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            const sessionData = {
                ...formData,
                creator: user.id,
                maxParticipants: parseInt(formData.maxParticipants)
            };

            const response = await fetch('http://localhost:5000/api/sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Session created successfully!');
                // Reset form
                setFormData({
                    title: '',
                    sessionType: 'public',
                    description: '',
                    department: '',
                    location: '',
                    schedule: '',
                    studyTopic: '',
                    courseCode: '',
                    maxParticipants: 10,
                    requirements: ''
                });
                // Redirect to sessions page or show success
                navigate('/user-sessions');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-session-container">
            <div className="text-session-header">
                <h1>Create Study Session</h1>
                <p>Create a new study session and invite others to join</p>
            </div>

            <div className="session-form-wrapper">
                <form onSubmit={handleSubmit} className="session-form">
                    {/* Session Basic Info */}
                    <div className="form-section">
                        <h3>Session Information</h3>
                        
                        <div className="form-group">
                            <label htmlFor="title">Session Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Combits Study Group"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionType">Session Type</label>
                            <select
                                id="sessionType"
                                name="sessionType"
                                value={formData.sessionType}
                                onChange={handleInputChange}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe what you'll be studying, goals, etc."
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="form-section">
                        <h3>Academic Details</h3>
                        
                        <div className="form-group">
                            <label htmlFor="department">Department *</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="CSS">Computer Science</option>
                                <option value="EE">Electrical Engineering</option>
                                <option value="BBA">Business Administration</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="studyTopic">Study Topic *</label>
                            <input
                                type="text"
                                id="studyTopic"
                                name="studyTopic"
                                value={formData.studyTopic}
                                onChange={handleInputChange}
                                placeholder="e.g., Data Structures, Calculus, Marketing"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="courseCode">Course Code</label>
                            <input
                                type="text"
                                id="courseCode"
                                name="courseCode"
                                value={formData.courseCode}
                                onChange={handleInputChange}
                                placeholder="e.g., CS-101, MATH-202"
                            />
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="form-section">
                        <h3>Schedule & Location</h3>
                        
                        <div className="form-group">
                            <label htmlFor="schedule">Schedule *</label>
                            <input
                                type="text"
                                id="schedule"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleInputChange}
                                placeholder="e.g., Every Monday 2-4 PM, This Friday 3 PM"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location *</label>
                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Online">Online</option>
                                <option value="On-Campus">On-Campus</option>
                                <option value="Library">Library</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {formData.location === 'Other' && (
                            <div className="form-group">
                                <label htmlFor="specificLocation">Specific Location</label>
                                <input
                                    type="text"
                                    id="specificLocation"
                                    name="specificLocation"
                                    value={formData.specificLocation}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Coffee Shop, Room 201"
                                />
                            </div>
                        )}
                    </div>

                    {/* Session Settings */}
                    <div className="form-section">
                        <h3>Session Settings</h3>
                        
                        <div className="form-group">
                            <label htmlFor="maxParticipants">Maximum Participants *</label>
                            <input
                                type="number"
                                id="maxParticipants"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleInputChange}
                                min="2"
                                max="50"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="requirements">Requirements</label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                placeholder="Any specific requirements? (e.g., Bring laptop, Pre-read chapter 3)"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Creator Info */}
                    <div className="creator-info">
                        <h4>Session Creator</h4>
                        <p><strong>Name:</strong> {user.fullName}</p>
                        <p><strong>Roll No:</strong> {user.rollNo}</p>
                        <p><strong>Department:</strong> {user.department}</p>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="create-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating Session...' : 'Create Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TextSession;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudyCircleDashboard = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const [studySessions, setStudySessions] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [newPost, setNewPost] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    // Get user data from localStorage and fetch sessions
    useEffect(() => {
        const initializeUser = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                fetchStudySessions();
                fetchCommunities();
            } else {
                navigate('/');
                return;
            }
        };

        const fetchStudySessions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sessions');
                const result = await response.json();
                if (result.success) {
                    setStudySessions(result.data.sessions || []);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                // For demo, use some mock data
                setStudySessions([]);
            }
        };

        const fetchCommunities = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/communities');
                const result = await response.json();
                if (result.success) {
                    setCommunities(result.data.communities || []);
                }
            } catch (error) {
                console.error('Error fetching communities:', error);
                // For demo, use some mock data
                setCommunities([
                    {
                        id: 1,
                        name: 'Calculus Study',
                        description: 'Advanced calculus and mathematical analysis',
                        members: 45,
                        icon: '📚',
                        isJoined: false
                    },
                    {
                        id: 2,
                        name: 'Computer Science',
                        description: 'Programming and algorithms study group',
                        members: 89,
                        icon: '💻',
                        isJoined: true
                    }
                ]);
            }
        };

        initializeUser();

        // Simulate API call delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [navigate]);

    // Generate user avatar based on name if no avatar URL
    const getUserAvatar = (userData) => {
        if (userData.avatar) return userData.avatar;
        return '/DefaultPic.jpeg';
    };

    // Generate username from email or roll number
    const getUsername = (userData) => {
        if (userData.email) {
            return userData.email.split('@')[0];
        }
        return userData.rollNo ? `@${userData.rollNo}` : '@user';
    };

    const handleLike = async (sessionId) => {
        // Optimistic update
        setStudySessions(sessions =>
            sessions.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        isLiked: !session.isLiked,
                        upvotes: session.isLiked ? session.upvotes - 1 : session.upvotes + 1
                    }
                    : session
            )
        );
    };

    const handleBookmark = (sessionId) => {
        setStudySessions(sessions =>
            sessions.map(session =>
                session.id === sessionId
                    ? { ...session, isBookmarked: !session.isBookmarked }
                    : session
            )
        );
    };

    const handleJoinCommunity = async (communityId) => {
        setCommunities(communities =>
            communities.map(community =>
                community.id === communityId
                    ? { ...community, isJoined: !community.isJoined }
                    : community
            )
        );
    };

    const handlePost = () => {
        if (!newPost.trim()) return;

        const newSession = {
            id: Date.now(),
            title: 'New Study Session',
            description: newPost,
            community: 'General',
            date: new Date().toISOString().split('T')[0],
            time: '14:00 - 16:00',
            location: 'Online',
            participants: 0,
            maxParticipants: 10,
            creator: user.fullName,
            creatorAvatar: getUserAvatar(user),
            tags: ['new'],
            upvotes: 0,
            comments: 0,
            reposts: 0,
            views: '0',
            isLiked: false,
            isBookmarked: false
        };

        setStudySessions(prev => [newSession, ...prev]);
        setNewPost('');
    };

    // In Dashboard.jsx - update the handleCreateSession function
    const handleCreateSession = () => {
        navigate('/SessionTypeSelection', { state: { user } });
    };

    const handleProfileClick = () => {
        navigate('/ProfileSection');
    };

    const handleJoinSession = async (sessionId, isPrivate = false) => {
        try {
            if (isPrivate) {
                // For private sessions, send join request
                alert('Join request sent! Waiting for approval.');
            } else {
                // For public sessions, join directly
                const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();
                if (result.success) {
                    alert('Successfully joined the session!');
                    // Navigate to the session
                    navigate(`/study-session/${sessionId}`);
                } else {
                    alert(result.message || 'Failed to join session');
                }
            }
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session');
        }
    };

    const handleOpenSession = (session) => {
        navigate(`/study-session/${session._id || session.id}`, { state: { session } });
    };

    const Sidebar = () => (
        <div className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-700 bg-gray-900">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <img
                        src="/combits.png"
                        alt="Combits Logo"
                        className="w-8 h-8"
                    />
                    <span className="text-white font-bold text-xl">Combits</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                <ul className="space-y-1">
                    {[
                        { id: 'feed', label: 'Home', icon: HomeIcon },
                        { id: 'explore', label: 'Explore', icon: ExploreIcon },
                        { id: 'notifications', label: 'Notifications', icon: NotificationsIcon },
                        { id: 'messages', label: 'Messages', icon: MessagesIcon },
                        { id: 'communities', label: 'Communities', icon: CommunitiesIcon },
                        { id: 'profile', label: 'Profile', icon: ProfileIcon }
                    ].map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.id === 'profile') {
                                        handleProfileClick();
                                    } else {
                                        setActiveTab(item.id);
                                    }
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${activeTab === item.id
                                    ? 'text-white bg-blue-600'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" active={activeTab === item.id} />
                                <span className={`text-lg ${activeTab === item.id ? 'font-bold' : 'font-normal'
                                    }`}>
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Create Session Button */}
            <div className="p-4">
                <button
                    onClick={handleCreateSession}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-bold text-lg"
                >
                    Create Session
                </button>
            </div>

            {/* User Profile */}
            {user && (
                <div
                    className="absolute bottom-4 left-4 right-4 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                    onClick={handleProfileClick}
                >
                    <div className="flex items-center space-x-3">
                        <img
                            src={getUserAvatar(user)}
                            alt={user.fullName || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">
                                {user.fullName || 'User'}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                                {getUsername(user)}
                            </p>
                        </div>
                        <MoreIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            )}
        </div>
    );

    const TweetCard = ({ session }) => (
        <div
            className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            onClick={() => handleOpenSession(session)}
        >
            <div className="p-4">
                <div className="flex space-x-3">
                    <img
                        src={session.creator?.avatar || '/DefaultPic.jpeg'}
                        alt={session.creator?.fullName || 'Creator'}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-white">{session.creator?.fullName || 'Unknown User'}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-400">{new Date(session.date).toLocaleDateString()}</span>
                        </div>

                        <h3 className="text-white font-semibold mb-2">{session.title}</h3>
                        <p className="text-gray-300 mb-3 leading-relaxed">{session.description}</p>

                        {/* Session Details */}
                        <div className="bg-gray-800 rounded-lg p-3 mb-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-white">{session.startTime} - {session.endTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white">{session.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">Participants:</span>
                                    <span className="text-white">{session.currentParticipants?.length || 0}/{session.maxParticipants}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">Subject:</span>
                                    <span className="text-blue-400">{session.subject}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {session.tags?.map((tag, index) => (
                                <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs">
                                    #{tag}
                                </span>
                            ))}
                            <span className={`px-2 py-1 rounded-full text-xs ${session.isPublic ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                                {session.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>

                        {/* Join Button */}
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4 text-sm text-gray-400">
                                <span>{session.upvotes?.length || 0} likes</span>
                                <span>{session.comments?.length || 0} comments</span>
                                <span>{session.views || 0} views</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinSession(session._id || session.id, !session.isPublic);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${!session.isPublic
                                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {!session.isPublic ? 'Request to Join' : 'Join Session'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const OngoingSessions = () => (
        <div className="rounded-2xl bg-gray-800 overflow-hidden">
            <h3 className="font-bold text-xl text-white p-4 border-b border-gray-700">Ongoing Sessions</h3>
            <div className="divide-y divide-gray-700">
                {studySessions.filter(session => session.status === 'ongoing').length > 0 ? (
                    studySessions
                        .filter(session => session.status === 'ongoing')
                        .slice(0, 3)
                        .map((session) => (
                            <div key={session.id} className="p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-start space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white text-sm mb-1">{session.title}</h4>
                                        <p className="text-gray-400 text-xs mb-2">{session.subject}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400">{session.startTime}</span>
                                            <span className="text-blue-400">{session.currentParticipants?.length || 0} joined</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full"
                                                style={{ width: `${((session.currentParticipants?.length || 0) / session.maxParticipants) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-400">No ongoing sessions</p>
                        <p className="text-gray-500 text-sm mt-1">Be the first to create one!</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleCreateSession}
                className="w-full p-4 text-blue-500 hover:bg-gray-700 transition-colors duration-200 text-left border-t border-gray-700"
            >
                Create a session
            </button>
        </div>
    );

    const RightSidebar = () => (
        <div className="w-80 space-y-4">
            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search sessions, communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Ongoing Sessions */}
            <OngoingSessions />

            {/* Trending Communities */}
            <div className="rounded-2xl bg-gray-800 overflow-hidden">
                <h3 className="font-bold text-xl text-white p-4 border-b border-gray-700">Trending Communities</h3>
                <div className="divide-y divide-gray-700">
                    {communities.length > 0 ? (
                        communities.map((community) => (
                            <div key={community.id || community._id} className="p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{community.icon}</span>
                                        <div>
                                            <h4 className="font-semibold text-white">{community.name}</h4>
                                            <p className="text-sm text-gray-400">{community.memberCount || community.members} members</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleJoinCommunity(community.id || community._id)}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${community.isJoined
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {community.isJoined ? 'Joined' : 'Join'}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-300 mt-2">{community.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-400">No communities yet</p>
                            <p className="text-gray-500 text-sm mt-1">Communities will appear here</p>
                        </div>
                    )}
                </div>
                <button className="w-full p-4 text-blue-500 hover:bg-gray-700 transition-colors duration-200 text-left border-t border-gray-700">
                    Discover more
                </button>
            </div>
        </div>
    );

    const FeedView = () => (
        <div className="max-w-2xl border-x border-gray-700 min-h-screen">
            {/* Home Header */}
            <div className="border-b border-gray-700 p-4 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur">
                <h2 className="text-xl font-bold text-white">Study Feed</h2>
            </div>

            {/* Create Post */}
            <div className="border-b border-gray-700 p-4">
                <div className="flex space-x-4">
                    <img
                        src={user ? getUserAvatar(user) : '/DefaultPic.png'}
                        alt="Your avatar"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                        <textarea
                            placeholder="Share your study progress or create a session..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none mb-4 resize-none"
                            rows="3"
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                {[
                                    { icon: MediaIcon, label: 'Media' },
                                    { icon: PollIcon, label: 'Poll' },
                                    { icon: ScheduleIcon, label: 'Schedule' }
                                ].map((item, index) => (
                                    <button key={index} className="flex items-center space-x-1 text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 p-2 rounded-lg transition-colors duration-200">
                                        <item.icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handlePost}
                                disabled={!newPost.trim()}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sessions Feed */}
            <div>
                {studySessions.length > 0 ? (
                    studySessions.map(session => (
                        <TweetCard key={session._id || session.id} session={session} />
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 text-lg mb-2">No study sessions yet</div>
                        <p className="text-gray-500 mb-4">Be the first to share a study session!</p>
                        <button
                            onClick={handleCreateSession}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Create First Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const ExploreView = () => (
        <div className="max-w-2xl border-x border-gray-700 min-h-screen">
            <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
                <h2 className="text-2xl font-bold text-white">Explore Sessions</h2>
            </div>
            <div className="p-6">
                {studySessions.length > 0 ? (
                    <div className="space-y-4">
                        {studySessions.map(session => (
                            <div key={session._id || session.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{session.title}</h3>
                                        <p className="text-gray-400 text-sm">by {session.creator?.fullName || 'Unknown User'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${session.isPublic ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                                        {session.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <p className="text-gray-300 mb-3">{session.description}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                                    <div>📅 {new Date(session.date).toLocaleDateString()}</div>
                                    <div>⏰ {session.startTime} - {session.endTime}</div>
                                    <div>📍 {session.location}</div>
                                    <div>👥 {session.currentParticipants?.length || 0}/{session.maxParticipants}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-wrap gap-1">
                                        {session.tags?.map((tag, index) => (
                                            <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleJoinSession(session._id || session.id, !session.isPublic)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${!session.isPublic
                                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {!session.isPublic ? 'Request to Join' : 'Join Session'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">No sessions available</div>
                        <p className="text-gray-500">Sessions will appear here when created</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMainContent = () => {
        if (isLoading) {
            return (
                <div className="max-w-2xl border-x border-gray-700 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading...</p>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'feed':
                return <FeedView />;
            case 'explore':
                return <ExploreView />;
            case 'notifications':
            case 'messages':
            case 'communities':
                return (
                    <div className="max-w-2xl border-x border-gray-700 min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-400 text-lg">Coming Soon</p>
                            <p className="text-gray-500">This feature is under development</p>
                        </div>
                    </div>
                );
            default:
                return <FeedView />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 min-h-screen flex justify-center">
                <div className="flex-1 max-w-4xl">
                    {renderMainContent()}
                </div>

                {/* Right Sidebar */}
                <div className="hidden lg:block w-80 p-4">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
};

// SVG Icon Components (keep all the same icon components from your original code)
const HomeIcon = ({ className, active }) => (
    <svg className={className} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ExploreIcon = ({ className, active }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const NotificationsIcon = ({ className, active }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M15 17h5l-5 5v-5zM8.515 4.5A3.5 3.5 0 015 7.5V9a3 3 0 01-3 3 1 1 0 010 2h7m5.485-9.5A3.5 3.5 0 0119 7.5V9a3 3 0 003 3 1 1 0 010 2h-7" />
    </svg>
);

const MessagesIcon = ({ className, active }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CommunitiesIcon = ({ className, active }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ProfileIcon = ({ className, active }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: active ? '#FFFFFF' : '#9CA3AF' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const MoreIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const CommentIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const RepostIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const ShareIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const MediaIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
    </svg>
);

const PollIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552.45 1 1 1s1-.448 1-1-.45-1-1-1-1 .448-1 1z" />
    </svg>
);

const ScheduleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 7V3v4zM16 7V3v4zM5 12h14H5zm15 5H4h16zm-4 3H8h8zm5-8v10c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V9c0-2.21 1.79-4 4-4h1V3c0-.55.45-1 1-1s1 .45 1 1v2h6V3c0-.55.45-1 1-1s1 .45 1 1v2h1c2.21 0 4 1.79 4 4z" />
    </svg>
);

export default StudyCircleDashboard;
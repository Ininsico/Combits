import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Theme configuration
    const currentTheme = {
        bg: 'bg-white',
        text: 'text-gray-900',
        secondaryText: 'text-gray-700',
        border: 'border-gray-200',
        button: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
        card: 'bg-white'
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }
            setLastScrollY(currentScrollY);
            setScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Navigation handlers
    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleHomeClick = () => {
        navigate('/');
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const menuItems = [
         { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' },
             { name: 'CUconnect', path: '/alumni' },
            
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isHidden ? '-translate-y-full' : 'translate-y-0'
                } ${scrollY > 50
                    ? `${currentTheme.bg}/95 backdrop-blur-md shadow-2xl border-b ${currentTheme.border}`
                    : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleHomeClick}
                    >
                        <div className={`text-2xl font-bold ${scrollY > 50 ? currentTheme.text : 'text-white'}`}>
                            COMBITS 2025
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg transition-all duration-300 lg:hidden ${scrollY > 50
                                ? `${currentTheme.text} ${currentTheme.border} border`
                                : 'text-white'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </motion.button>

                        <div className="hidden lg:flex items-center space-x-8">
                            {menuItems.map((item) => (
                                <motion.button
                                    key={item.name}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`font-medium px-4 py-2 rounded-lg transition-all duration-200 ${scrollY > 50 ? currentTheme.secondaryText : 'text-white'} hover:bg-green-500/10`}
                                >
                                    {item.name}
                                </motion.button>
                            ))}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigation('/login')}
                                className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${currentTheme.button} border border-green-600 hover:shadow-lg hover:-translate-y-0.5`}
                            >
                                Login
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-40 lg:hidden pt-20"
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className={`absolute top-20 right-4 rounded-2xl shadow-2xl min-w-64 max-w-sm border ${currentTheme.card} ${currentTheme.border}`}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <div className="py-4">
                                {menuItems.map((item) => (
                                    <motion.button
                                        key={item.name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full text-left px-6 py-4 transition-all duration-200 border-b ${currentTheme.border} ${currentTheme.secondaryText} hover:bg-green-500/10`}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleNavigation('/login')}
                                    className={`w-full text-left px-6 py-4 ${currentTheme.button} font-bold`}
                                >
                                    Login
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

const Footer = () => {
  const currentTheme = {
    border: 'border-gray-200',
    bg: 'bg-white',
    text: 'text-gray-900',
    mutedText: 'text-gray-600'
  };

  return (
    <footer className={`py-12 border-t ${currentTheme.border} ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>COMBITS 2025</div>
            <p className={`${currentTheme.mutedText}`}>
              Premier tech event organized by COMSATS University Islamabad, Attock Campus. 
              Where innovation meets excellence.
            </p>
          </div>
          {[
            {
              title: 'Event',
              links: ['About', 'Schedule', 'Competitions', 'Workshops']
            },
            {
              title: 'Information',
              links: ['Contact', 'Venue', 'Sponsors', 'FAQs']
            }
          ].map((section) => (
            <div key={section.title}>
              <h4 className={`font-bold text-lg mb-4 ${currentTheme.text}`}>{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`hover:text-green-500 transition-colors ${currentTheme.mutedText}`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`border-t ${currentTheme.border} mt-12 pt-8 text-center ${currentTheme.mutedText}`}>
          <p>&copy; 2025 COMBITS - COMSATS University Islamabad, Attock Campus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const CUConnectPage = () => {
  const [activeTab, setActiveTab] = useState('meet');
  const [meetingId, setMeetingId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const features = [
    {
      icon: '🎥',
      title: 'Video Conferencing',
      description: 'High-quality video meetings with up to 100 participants',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💬',
      title: 'Instant Messaging',
      description: 'Real-time chat and file sharing capabilities',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '📁',
      title: 'File Sharing',
      description: 'Share documents and collaborate in real-time',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '👥',
      title: 'Group Collaboration',
      description: 'Create study groups and project teams',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: '📅',
      title: 'Schedule Meetings',
      description: 'Plan and schedule sessions with calendar integration',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'End-to-end encryption for all your communications',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const quickActions = [
    { icon: '🚀', label: 'New Meeting', action: () => setActiveTab('meet') },
    { icon: '📅', label: 'Schedule', action: () => setActiveTab('schedule') },
    { icon: '👥', label: 'Join Meeting', action: () => setActiveTab('join') },
    { icon: '💻', label: 'Screen Share', action: () => window.open('https://comsatsconnect.vercel.app/', '_blank') }
  ];

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingId) {
      window.open(`https://comsatsconnect.vercel.app/join/${meetingId}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-6">🎓</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              CUConnect
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              COMSATS University's Official Collaboration Platform
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Connect, collaborate, and communicate with students and faculty through our integrated platform. 
              Video meetings, instant messaging, and file sharing in one secure environment.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* External Link Button */}
            <motion.a
              href="https://comsatsconnect.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl"
            >
              <span>🚀</span>
              <span>Launch CUConnect Platform</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-xl text-slate-300">Everything you need for seamless collaboration</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Actions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            {/* Tabs */}
            <div className="flex space-x-4 mb-8">
              {['meet', 'join', 'schedule'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {tab === 'meet' && '🚀 New Meeting'}
                  {tab === 'join' && '👥 Join Meeting'}
                  {tab === 'schedule' && '📅 Schedule'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-64">
              {activeTab === 'meet' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-6">🎯</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Start Instant Meeting</h3>
                  <p className="text-slate-300 mb-8">
                    Start a new video meeting instantly and invite participants
                  </p>
                  <motion.a
                    href="https://comsatsconnect.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    <span>🎥</span>
                    <span>Start Meeting Now</span>
                  </motion.a>
                </motion.div>
              )}

              {activeTab === 'join' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-6">🔗</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Join a Meeting</h3>
                  <p className="text-slate-300 mb-6">
                    Enter meeting ID provided by the host
                  </p>
                  <form onSubmit={handleJoinMeeting} className="max-w-md mx-auto">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        placeholder="Enter Meeting ID"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Join
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-6">📅</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Schedule Meeting</h3>
                  <p className="text-slate-300 mb-8">
                    Plan your meetings in advance and send invitations
                  </p>
                  <motion.a
                    href="https://comsatsconnect.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    <span>📅</span>
                    <span>Open Scheduler</span>
                  </motion.a>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Integrated with CUI Ecosystem</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Seamlessly connected with your COMSATS University account, courses, and academic calendar
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '🎓', title: 'Student Portal', desc: 'Single sign-on with CUI credentials' },
              { icon: '📚', title: 'Course Integration', desc: 'Automatic course group creation' },
              { icon: '🔄', title: 'Sync Calendar', desc: 'Integrated with academic schedule' },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-3xl p-12 border border-green-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Connect?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of COMSATS students and faculty already using CUConnect
            </p>
            <motion.a
              href="https://comsatsconnect.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl"
            >
              <span>🚀</span>
              <span>Launch CUConnect Now</span>
              <span>➔</span>
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CUConnectPage;
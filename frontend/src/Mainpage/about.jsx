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
        { name: 'Campus', path: '/campus' },
        { name: 'Contact', path: '/contact' },
        { name: 'CUconnect', path: '/alumni' },
        { name: 'News', path: '/news' },
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
                                Register
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
                                    Register
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <Header />
      <section className="pt-20">
        {/* Hero Section */}
        {/* Study Circle Platform Feature */}
<div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900/20 to-green-800/30">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">New CUI Feature: Study Circle</h2>
      <p className="text-xl text-slate-300">Revolutionizing Student Collaboration at COMSATS</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-2xl p-8 border border-emerald-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">Study Group Finder Platform</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            A comprehensive web-based platform integrated into CUI's ecosystem to help students 
            create, discover, and join study groups for their courses. This innovative solution 
            enables COMSATS students to connect with peers, schedule study sessions, and 
            collaborate effectively for academic success.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-emerald-300 font-semibold">Core Features</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>CUI Integrated Authentication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Study Group Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Course-based Matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Session Scheduling</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-green-300 font-semibold">Benefits</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Enhanced Collaboration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Academic Success</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Peer Networking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Time Management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <h3 className="text-2xl font-bold text-white">Platform Availability</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-300">Status</span>
              <span className="text-emerald-300 font-semibold">Live Now</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-300">Access</span>
              <span className="text-blue-300 font-semibold">All CUI Students</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-300">Integration</span>
              <span className="text-amber-300 font-semibold">CUI Portal</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-300">Support</span>
              <span className="text-purple-300 font-semibold">IT Department</span>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
            Connect to Study Circle
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-6 border border-blue-500/20">
          <h4 className="text-lg font-bold text-white mb-3">Coming Soon to Mobile</h4>
          <p className="text-slate-300 text-sm">
            The Study Circle platform will soon be available as a mobile app for 
            iOS and Android devices, making student collaboration even more accessible.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
        <div className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About <span className="text-emerald-400">COMBITS 2025</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Premier Tech Event Organized by COMSATS University Islamabad, 
                Attock Campus - Where Innovation Meets Excellence
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Our Legacy</h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  COMBITS stands as the flagship technical event of COMSATS University 
                  Islamabad, Attock Campus. Since its inception, it has been a platform 
                  where brilliant minds converge to showcase innovation, compete in 
                  challenging competitions, and shape the future of technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-400/30">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-emerald-300 text-sm">Participants</div>
                  </div>
                  <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-400/30">
                    <div className="text-2xl font-bold text-white">20+</div>
                    <div className="text-blue-300 text-sm">Events</div>
                  </div>
                  <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-purple-300 text-sm">Days</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <img 
                  src="/comsats-campus.jpg" 
                  alt="COMSATS University Campus"
                  className="w-full h-64 object-cover rounded-xl mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold text-white">COMSATS University</h3>
                  <p className="text-slate-100">Islamabad, Attock Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white border border-emerald-500/20">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed mb-6 text-slate-100">
                  To create a transformative educational experience for students focused 
                  on deep disciplinary knowledge, problem solving, leadership, communication, 
                  and interpersonal skills, and personal health and well-being.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Foster innovation and technological advancement</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Promote research and development culture</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Develop industry-academia collaboration</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white border border-blue-500/20">
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-lg leading-relaxed mb-6 text-slate-100">
                  To be a world-class university recognized for its commitment to 
                  excellence in teaching, research, and innovation that contributes 
                  to the socio-economic development of Pakistan.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span>Global recognition in STEM education</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span>Pioneering research initiatives</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-100">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span>Nurturing future technology leaders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">University Leadership</h2>
              <p className="text-xl text-slate-300">Guiding Excellence in Education</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 text-center border border-slate-600 hover:border-emerald-500 transition-all duration-300">
  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg overflow-hidden">
    <img 
      src="RaheelQamar.jpg" 
      alt="Rector"
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div className="hidden w-full h-full items-center justify-center bg-emerald-600">
      <span className="text-white text-2xl">👨‍🎓</span>
    </div>
  </div>
  <h3 className="text-xl font-bold text-white mb-2">Prof.Dr.Raheel Qamar</h3>
  <p className="text-emerald-300 mb-4">Rector, COMSATS University Islamabad</p>
  <p className="text-slate-300 text-sm leading-relaxed">
    Leading the university towards academic excellence and innovation 
    with visionary leadership and dedication.
  </p>
</div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 text-center border border-slate-600 hover:border-blue-500 transition-all duration-300">
  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg overflow-hidden">
    <img 
      src="cuiattockdir.jpg" 
      alt="Prof. Dr. Laiq Khan"
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div className="hidden w-full h-full items-center justify-center bg-blue-600">
      <span className="text-white text-2xl">👨‍🏫</span>
    </div>
  </div>
  <h3 className="text-xl font-bold text-white mb-2">Prof. Dr. Laiq Khan</h3>
  <p className="text-blue-300 mb-4">Director, Attock Campus</p>
  <p className="text-slate-300 text-sm leading-relaxed">
    Spearheading the growth and development of Attock Campus with 
    commitment to quality education and student success.
  </p>
</div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 text-center border border-slate-600 hover:border-purple-500 transition-all duration-300">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                  🤝
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Event Organizers</h3>
                <p className="text-purple-300 mb-4">COMBITS 2025 Team</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Dedicated team of faculty and students working tirelessly to make 
                  COMBITS 2025 an unforgettable experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMBITS Events */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/30 to-blue-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">COMBITS Events & Competitions</h2>
              <p className="text-xl text-slate-300">Showcasing Technical Excellence</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  icon: "💻", 
                  title: "Hackathon", 
                  desc: "24-hour coding marathon to solve real-world problems",
                  color: "from-emerald-500/20 to-emerald-600/20",
                  border: "border-emerald-500/30",
                  hover: "hover:border-emerald-400"
                },
                { 
                  icon: "🤖", 
                  title: "Robotics", 
                  desc: "Design and programming challenges for autonomous systems",
                  color: "from-blue-500/20 to-blue-600/20",
                  border: "border-blue-500/30",
                  hover: "hover:border-blue-400"
                },
                { 
                  icon: "🔐", 
                  title: "Cybersecurity", 
                  desc: "CTF competitions and security challenges",
                  color: "from-purple-500/20 to-purple-600/20",
                  border: "border-purple-500/30",
                  hover: "hover:border-purple-400"
                },
                { 
                  icon: "📱", 
                  title: "App Development", 
                  desc: "Mobile and web application development contests",
                  color: "from-amber-500/20 to-amber-600/20",
                  border: "border-amber-500/30",
                  hover: "hover:border-amber-400"
                },
                { 
                  icon: "🌐", 
                  title: "Web Technologies", 
                  desc: "Frontend and backend development challenges",
                  color: "from-cyan-500/20 to-cyan-600/20",
                  border: "border-cyan-500/30",
                  hover: "hover:border-cyan-400"
                },
                { 
                  icon: "📊", 
                  title: "Data Science", 
                  desc: "Data analysis and machine learning competitions",
                  color: "from-red-500/20 to-red-600/20",
                  border: "border-red-500/30",
                  hover: "hover:border-red-400"
                },
              ].map((event, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${event.color} rounded-xl p-6 border ${event.border} ${event.hover} transition-all duration-300 group hover:scale-105`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{event.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  <p className="text-slate-300">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Co-Curricular Activities */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Co-Curricular Activities</h2>
              <p className="text-xl text-slate-300">Beyond the Classroom Learning</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
                <h3 className="text-2xl font-bold text-white mb-6">Student Societies</h3>
                <div className="space-y-4">
                  {[
                    { name: "ACM Student Chapter - Association for Computing Machinery", color: "bg-emerald-500" },
                    { name: "IEEE Student Branch - Institute of Electrical and Electronics Engineers", color: "bg-blue-500" },
                    { name: "Developer Student Clubs - Google Developers", color: "bg-purple-500" },
                    { name: "Robotics Society", color: "bg-amber-500" },
                    { name: "Cyber Security Club", color: "bg-cyan-500" },
                    { name: "Entrepreneurship Society", color: "bg-red-500" }
                  ].map((society, index) => (
                    <div key={index} className="flex items-center space-x-4 text-slate-300 group hover:text-white transition-colors duration-200">
                      <div className={`w-3 h-3 ${society.color} rounded-full group-hover:scale-125 transition-transform duration-200`}></div>
                      <span className="flex-1">{society.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
                <h3 className="text-2xl font-bold text-white mb-6">Workshops & Seminars</h3>
                <div className="space-y-4">
                  {[
                    { name: "Industry Expert Talks and Tech Sessions", color: "bg-emerald-500" },
                    { name: "Research Methodology Workshops", color: "bg-blue-500" },
                    { name: "Career Development and Placement Training", color: "bg-purple-500" },
                    { name: "Technical Skill Development Programs", color: "bg-amber-500" },
                    { name: "Innovation and Startup Incubation", color: "bg-cyan-500" },
                    { name: "Leadership and Team Building Activities", color: "bg-red-500" }
                  ].map((workshop, index) => (
                    <div key={index} className="flex items-center space-x-4 text-slate-300 group hover:text-white transition-colors duration-200">
                      <div className={`w-3 h-3 ${workshop.color} rounded-full group-hover:scale-125 transition-transform duration-200`}></div>
                      <span className="flex-1">{workshop.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/30 to-purple-900/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">COMSATS Journey</h2>
              <p className="text-xl text-slate-300">A Legacy of Excellence</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  year: "1998",
                  title: "Establishment",
                  description: "COMSATS University Islamabad established as a public sector university",
                  color: "bg-emerald-500"
                },
                {
                  year: "2000",
                  title: "First Campus",
                  description: "Islamabad campus becomes operational with initial programs",
                  color: "bg-blue-500"
                },
                {
                  year: "2010",
                  title: "Expansion",
                  description: "Multiple campuses established across Pakistan including Attock",
                  color: "bg-purple-500"
                },
                {
                  year: "2015",
                  title: "Recognition",
                  description: "Ranked among top universities in Pakistan by HEC",
                  color: "bg-amber-500"
                },
                {
                  year: "2020",
                  title: "Digital Transformation",
                  description: "Implementation of advanced digital learning infrastructure",
                  color: "bg-cyan-500"
                },
                {
                  year: "2025",
                  title: "COMBITS 2025",
                  description: "Hosting the largest tech event in university history",
                  color: "bg-red-500"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6 group hover:scale-105 transition-transform duration-300">
                  <div className={`flex-shrink-0 w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.year}
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 group-hover:border-slate-500 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Join COMBITS 2025</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of the most exciting tech event of the year. Showcase your skills, 
              learn from experts, and connect with the tech community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Register Now
              </button>
              <button className="border border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
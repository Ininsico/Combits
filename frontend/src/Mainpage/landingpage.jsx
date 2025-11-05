import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const SchoolManagementLanding = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    // Tech Event Theme colors - Blue and White scheme
    const theme = {
        dark: {
            bg: 'bg-gray-900',
            text: 'text-white',
            secondaryText: 'text-gray-300',
            mutedText: 'text-gray-500',
            border: 'border-gray-700',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            buttonSecondary: 'border-2 border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white',
            card: 'bg-gray-800 border border-gray-700',
            gradient: 'from-gray-900 via-blue-900 to-gray-900',
            accent: 'blue'
        },
        light: {
            bg: 'bg-white',
            text: 'text-gray-900',
            secondaryText: 'text-gray-700',
            mutedText: 'text-gray-500',
            border: 'border-gray-300',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            buttonSecondary: 'border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white',
            card: 'bg-gray-50 border border-gray-300',
            gradient: 'from-blue-50 via-white to-blue-50',
            accent: 'blue'
        }
    };

    const currentTheme = darkMode ? theme.dark : theme.light;

    const Header = () => {
        const navigate = useNavigate();
        const [scrollY, setScrollY] = useState(0);
        const [lastScrollY, setLastScrollY] = useState(0);
        const [isHidden, setIsHidden] = useState(false);

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

                // Update active section
                const sections = ['hero', 'about', 'features', 'stats', 'testimonials', 'pricing', 'contact'];
                const current = sections.find(section => {
                    const element = document.getElementById(section);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        return rect.top <= 100 && rect.bottom >= 100;
                    }
                    return false;
                });
                if (current) setActiveSection(current);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }, [lastScrollY]);

        const scrollToSection = (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            setIsMenuOpen(false);
        };

        // Navigation handlers
        const handleNavigation = (path) => {
            navigate(path);
            setIsMenuOpen(false);
        };

        const handleHomeClick = () => {
            navigate('/');
            // Scroll to top if we're already on home page
            if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const menuItems = [
            { name: 'About', path: '/about' },
 
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
                        ? `${currentTheme.bg}/95 backdrop-blur-md shadow-2xl border-b ${currentTheme.border}/50`
                        : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center space-x-3 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleHomeClick}
                        >
                            {/* Logo - Replace with your image path */}
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <div className={`text-xl sm:text-2xl font-bold ${currentTheme.text}`}>
                                COMBITS
                            </div>
                        </motion.div>

                        <div className="flex items-center space-x-4 sm:space-x-6">
                            {/* Mobile Menu Button */}
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

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center space-x-6">
                                {menuItems.map((item) => (
                                    <motion.button
                                        key={item.name}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`font-medium px-4 py-2 rounded-lg transition-all duration-200 ${currentTheme.secondaryText} hover:bg-blue-500/10`}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleNavigation('/register')}
                                    className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${currentTheme.button} border ${currentTheme.border}`}
                                >
                                    Register
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
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
                                className={`absolute top-20 right-4 rounded-2xl shadow-2xl w-64 max-w-sm border ${currentTheme.card} ${currentTheme.border}`}
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
                                            className={`w-full text-left px-6 py-4 transition-all duration-200 border-b ${currentTheme.border}/30 ${currentTheme.secondaryText} hover:bg-blue-500/10`}
                                        >
                                            {item.name}
                                        </motion.button>
                                    ))}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleNavigation('/register')}
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

    const HeroSection = () => {
        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        };

        const itemVariants = {
            hidden: { y: 50, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.8,
                    ease: "easeOut"
                }
            }
        };

        return (
            <section id="hero" className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 py-20 relative">
                {/* Background gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]"
                    >
                        {/* Text Content - Left Side */}
                        <motion.div variants={itemVariants} className="hero-item text-center md:text-left">
                            <motion.h1
                                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-white"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                COMBITS <span className="text-blue-400">2025</span>
                            </motion.h1>
                            <motion.p
                                className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Tech Event Organized by COMSATS University Islamabad, Attock Campus
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg bg-blue-600 text-white transition-all duration-200 shadow-lg"
                                >
                                    Register Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, borderColor: "#3b82f6", color: "#3b82f6" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border-2 border-gray-600 text-gray-300 transition-all duration-200"
                                >
                                    View Schedule
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Image/Graphic - Right Side */}
                        <motion.div
                            variants={itemVariants}
                            className="hero-item flex justify-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="relative">
                                {/* Main image container */}
                                <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-800 to-blue-900 rounded-3xl border border-blue-700 shadow-2xl flex items-center justify-center overflow-hidden">
                                    {/* Replace with your actual image from public folder */}
                                    <img
                                        src="/combits-logo.png"
                                        alt="COMBITS Tech Event"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            // Fallback to emoji if image fails to load
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback content */}
                                    <div className="hidden text-center p-4">
                                        <div className="h-32 w-32 bg-blue-600/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-blue-500/30">
                                            <span className="text-5xl">🚀</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">COMBITS 2025</h3>
                                        <p className="text-gray-400">Tech Event</p>
                                    </div>
                                </div>

                                {/* Floating elements for visual interest */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-400/10 rounded-2xl border border-blue-400/20 backdrop-blur-sm"
                                    animate={{
                                        y: [0, 10, 0],
                                        rotate: [0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-3 bg-blue-500 rounded-full mt-2"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>
        );
    };

    // Add other sections here (AboutSection, FeaturesSection, etc.)
    // ... [Rest of the component sections]

    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>
            <Header />
            <HeroSection />
            {/* Add other sections here */}
        </div>
    );
};

export default SchoolManagementLanding;
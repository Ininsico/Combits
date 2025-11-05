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
        // Scroll to top if we're already on home page
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
                            Kids Heaven School
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-6">
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

export default Header;
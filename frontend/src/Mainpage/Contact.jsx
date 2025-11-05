import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    const contactInfo = [
        {
            icon: '📞',
            title: 'Phone',
            details: '+1 (555) 123-4567',
            subtitle: 'Mon-Fri from 8am to 5pm',
        },
        {
            icon: '✉️',
            title: 'Email',
            details: 'info@school.edu',
            subtitle: 'We\'ll reply within 24 hours',
        },
        {
            icon: '📍',
            title: 'Address',
            details: '123 Education Street',
            subtitle: 'City, State 12345',
        },
        {
            icon: '🕒',
            title: 'Office Hours',
            details: '8:00 AM - 4:00 PM',
            subtitle: 'Monday to Friday',
        }
    ];

    // Email animation styles
    const emailStyles = {
        container: {
            background: 'transparent',
            height: '300px',
            position: 'relative',
            marginBottom: '2rem'
        },
        letterImage: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            transform: `translate(-50%, -50%) ${isHovered ? 'translateY(20px)' : ''}`,
            cursor: 'pointer',
            transition: 'transform 0.4s'
        },
        animatedMail: {
            position: 'absolute',
            height: '150px',
            width: '200px',
            transition: '0.4s',
            transform: isHovered ? 'translateY(20px)' : 'translateY(0)'
        },
        body: {
            position: 'absolute',
            bottom: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 0 100px 200px',
            borderColor: 'transparent transparent #000 transparent',
            zIndex: 2
        },
        topFold: {
            position: 'absolute',
            top: '50px',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '50px 100px 0 100px',
            transformOrigin: '50% 0%',
            transition: `transform 0.4s ${isHovered ? '0s' : '0.4s'}, z-index 0.2s ${isHovered ? '0s' : '0.4s'}`,
            borderColor: '#333 transparent transparent transparent',
            zIndex: isHovered ? 0 : 2,
            transform: isHovered ? 'rotateX(180deg)' : 'rotateX(0deg)'
        },
        backFold: {
            position: 'absolute',
            bottom: 0,
            width: '200px',
            height: '100px',
            background: '#333',
            zIndex: 0
        },
        leftFold: {
            position: 'absolute',
            bottom: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '50px 0 50px 100px',
            borderColor: 'transparent transparent transparent #222',
            zIndex: 2
        },
        letter: {
            left: '20px',
            bottom: '0px',
            position: 'absolute',
            width: '160px',
            height: isHovered ? '180px' : '60px',
            background: 'white',
            zIndex: 1,
            overflow: 'hidden',
            transition: '0.4s 0.2s',
            border: '1px solid #000'
        },
        letterBorder: {
            height: '10px',
            width: '100%',
            background: `repeating-linear-gradient(
                -45deg,
                #000,
                #000 8px,
                transparent 8px,
                transparent 18px
            )`
        },
        letterTitle: {
            marginTop: '10px',
            marginLeft: '5px',
            height: '10px',
            width: '40%',
            background: '#000'
        },
        letterContext: {
            marginTop: '10px',
            marginLeft: '5px',
            height: '10px',
            width: '20%',
            background: '#000'
        },
        letterStamp: {
            marginTop: '30px',
            marginLeft: '120px',
            borderRadius: '100%',
            height: '30px',
            width: '30px',
            background: '#000',
            opacity: 0.3
        },
        shadow: {
            position: 'absolute',
            top: '200px',
            left: '50%',
            width: isHovered ? '250px' : '400px',
            height: '30px',
            transition: '0.4s',
            transform: 'translateX(-50%)',
            borderRadius: '100%',
            background: 'radial-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.0), rgba(0,0,0,0.0))'
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    GET IN <span className="text-gray-600">TOUCH</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information with Email Animation */}
                    <div className="space-y-8">
                        {/* Email Animation */}
                        <div className="bg-white rounded-2xl border-2 border-black p-8">
                            <h2 className="text-2xl font-bold text-black mb-6 text-center">SEND US A MESSAGE</h2>
                            <div 
                                style={emailStyles.container}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div style={emailStyles.letterImage}>
                                    <div style={emailStyles.animatedMail}>
                                        <div style={emailStyles.backFold}></div>
                                        <div style={emailStyles.letter}>
                                            <div style={emailStyles.letterBorder}></div>
                                            <div style={emailStyles.letterTitle}></div>
                                            <div style={emailStyles.letterContext}></div>
                                            <div style={emailStyles.letterStamp}></div>
                                        </div>
                                        <div style={emailStyles.topFold}></div>
                                        <div style={emailStyles.body}></div>
                                        <div style={emailStyles.leftFold}></div>
                                    </div>
                                    <div style={emailStyles.shadow}></div>
                                </div>
                            </div>
                            <p className="text-center text-gray-600 mt-4">Hover over the envelope to open</p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl border-2 border-black p-8">
                            <h2 className="text-2xl font-bold text-black mb-6">CONTACT INFORMATION</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contactInfo.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-6 rounded-xl border-2 border-black bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                                    >
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h3 className="text-lg font-semibold text-black mb-1">{item.title}</h3>
                                        <p className="text-black font-medium">{item.details}</p>
                                        <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl border-2 border-black p-8">
                        <h2 className="text-2xl font-bold text-black mb-6">CONTACT FORM</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                                        FULL NAME *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                        EMAIL ADDRESS *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                                    SUBJECT *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                                    MESSAGE *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none resize-none bg-white"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 border-2 border-black ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-white hover:text-black hover:shadow-2xl'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        SENDING...
                                    </div>
                                ) : (
                                    'SEND MESSAGE →'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Emergency Contact Banner */}
                <div className="mt-12 bg-black border-2 border-black rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl mr-2 text-white">🚨</span>
                        <h3 className="text-lg font-semibold text-white">EMERGENCY CONTACT</h3>
                    </div>
                    <p className="text-white">
                        For urgent matters outside office hours, please call our emergency line:{' '}
                        <strong className="text-white">+1 (555) 911-HELP</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

const Contact = () => {
    return (
        <div className="bg-white">
            <Header />
            <ContactPage />
            <Footer />
        </div>
    );
}

export default Contact;
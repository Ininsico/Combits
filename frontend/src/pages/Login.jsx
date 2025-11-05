import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const LoginPage = () => {
    const API_BASE_URL = 'http://localhost:5000/api';
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        semester: '',
        department: '',
        rollNo: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: ''
    });

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const inputRefs = useRef([]);
    const buttonRef = useRef(null);
    const switchRef = useRef(null);

    const semesters = [
        'FA20', 'FA21', 'FA22', 'FA23', 'FA24', 'FA25',
        'SP20', 'SP21', 'SP22', 'SP23', 'SP24', 'SP25'
    ];

    const departments = ['CSS', 'EE', 'BBA', 'Other'];

    const addToInputRefs = (el) => {
        if (el && !inputRefs.current.includes(el)) {
            inputRefs.current.push(el);
        }
    };

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        )
            .fromTo(titleRef.current,
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            )
            .fromTo(formRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.4"
            )
            .fromTo(inputRefs.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
                "-=0.3"
            )
            .fromTo(buttonRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" },
                "-=0.2"
            )
            .fromTo(switchRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );

        return () => {
            tl.kill();
        };
    }, []);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.to(formRef.current, {
            x: 20,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
        })
            .add(() => {
                gsap.set(formRef.current, { x: -20, opacity: 0 });
            })
            .to(formRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });

        gsap.fromTo(titleRef.current,
            { scale: 1.1 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    }, [isLogin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (e.target.type !== 'select-one') {
            const input = e.target;
            gsap.to(input, {
                scale: 1.02,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        gsap.to(buttonRef.current, {
            scale: 0.95,
            duration: 0.2,
            ease: "power2.inOut"
        });

        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                const confirmPasswordInput = inputRefs.current.find(ref =>
                    ref?.name === 'confirmPassword'
                );
                if (confirmPasswordInput) {
                    gsap.to(confirmPasswordInput, {
                        x: 10,
                        duration: 0.1,
                        repeat: 5,
                        yoyo: true,
                        ease: "power1.inOut",
                        onComplete: () => {
                            gsap.to(confirmPasswordInput, { x: 0, duration: 0.1 });
                        }
                    });
                }
                setIsLoading(false);
                return;
            }
        }

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const payload = isLogin ? {
                semester: formData.semester,
                department: formData.department,
                rollNo: formData.rollNo,
                password: formData.password
            } : {
                semester: formData.semester,
                department: formData.department,
                rollNo: formData.rollNo,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            gsap.to(formRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            });

            const successTimeline = gsap.timeline();
            successTimeline.to(containerRef.current, {
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                duration: 0.5,
                ease: "power2.out"
            })
                .to(buttonRef.current, {
                    backgroundColor: "#10B981",
                    duration: 0.3,
                    ease: "power2.out"
                });

            console.log('Success:', data);

        } catch (error) {
            console.error('Error:', error);
            const errorTimeline = gsap.timeline();
            errorTimeline.to(containerRef.current, {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                duration: 0.5,
                ease: "power2.out"
            })
                .to(buttonRef.current, {
                    backgroundColor: "#EF4444",
                    duration: 0.3,
                    ease: "power2.out"
                });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchMode = () => {
        gsap.to(switchRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
        });

        setIsLogin(!isLogin);
    };

    const handleInputFocus = (e) => {
        gsap.to(e.target, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out"
        });

        gsap.to(e.target, {
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleInputBlur = (e) => {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        });

        gsap.to(e.target, {
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111827',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '2rem'
    };

    const cardStyle = {
        background: 'rgba(31, 41, 55, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const titleStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, #D6BE2E 0%, #F59E0B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };

    const inputGroupStyle = {
        position: 'relative'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: '600',
        marginBottom: '0.4rem',
        color: '#D6BE2E',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23D6BE2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.8rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.2em 1.2em',
        paddingRight: '2.5rem',
        cursor: 'pointer'
    };

    const buttonStyle = {
        width: '100%',
        padding: '0.9rem 2rem',
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '0.5rem'
    };

    const loadingStyle = {
        display: 'inline-block',
        width: '18px',
        height: '18px',
        border: '2px solid rgba(255,255,255,.3)',
        borderRadius: '50%',
        borderTopColor: '#fff',
        animation: 'spin 1s ease-in-out infinite'
    };

    const switchStyle = {
        background: 'none',
        border: 'none',
        color: '#D6BE2E',
        fontSize: '0.8rem',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginTop: '1rem',
        display: 'block',
        width: '100%',
        textAlign: 'center'
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            <div ref={formRef} style={cardStyle}>
                <h2 ref={titleRef} style={titleStyle}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputGroupStyle} ref={addToInputRefs}>
                        <label style={labelStyle}>Semester</label>
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={selectStyle}
                            required
                        >
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem} style={{ background: '#1F2937', color: 'white' }}>
                                    {sem}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={inputGroupStyle} ref={addToInputRefs}>
                        <label style={labelStyle}>Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={selectStyle}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} style={{ background: '#1F2937', color: 'white' }}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={inputGroupStyle} ref={addToInputRefs}>
                        <label style={labelStyle}>Roll Number</label>
                        <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            pattern="[0-9]+"
                            title="Please enter numbers only"
                            style={inputStyle}
                            placeholder="Enter your roll number"
                            required
                        />
                    </div>

                    <div style={inputGroupStyle} ref={addToInputRefs}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={inputStyle}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div style={inputGroupStyle} ref={addToInputRefs}>
                                <label style={labelStyle}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    style={inputStyle}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <div style={inputGroupStyle} ref={addToInputRefs}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    style={inputStyle}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div style={inputGroupStyle} ref={addToInputRefs}>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    style={inputStyle}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        ref={buttonRef}
                        type="submit"
                        style={buttonStyle}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div style={loadingStyle}></div>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <button
                    ref={switchRef}
                    onClick={handleSwitchMode}
                    style={switchStyle}
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          select:focus, input:focus {
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          }

          select option {
            background: #1F2937 !important;
            color: white !important;
            padding: 10px !important;
          }

          select:required:invalid {
            color: #9CA3AF;
          }

          select option[value=""][disabled] {
            display: none;
          }

          select option {
            color: white;
            background: #1F2937;
            padding: 12px;
          }

          select {
            z-index: 10;
            position: relative;
          }

          select::-ms-expand {
            display: none;
          }

          @media (max-width: 768px) {
            .container {
              padding: 1rem;
            }
          }
        `
            }} />
        </div>
    );
};

export default LoginPage;
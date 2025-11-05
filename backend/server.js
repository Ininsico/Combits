const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-fucking-jwt-secret-change-this';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-auth';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    semester: {
        type: String,
        required: true,
        enum: ['FA20', 'FA21', 'FA22', 'FA23', 'FA24', 'FA25', 'SP20', 'SP21', 'SP22', 'SP23', 'SP24', 'SP25']
    },
    department: {
        type: String,
        required: true,
        enum: ['CSS', 'EE', 'BBA', 'Other']
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Simple JWT implementation
const generateToken = (userId) => {
    return Buffer.from(JSON.stringify({
        userId,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    })).toString('base64');
};

const verifyToken = (token) => {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        if (Date.now() > decoded.exp) {
            throw new Error('Token expired');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Fucking Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is fucking running!', 
        timestamp: new Date().toISOString() 
    });
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { semester, department, rollNo, password, fullName, email } = req.body;

        console.log('Signup attempt:', { semester, department, rollNo, fullName, email });

        // Validation
        if (!semester || !department || !rollNo || !password || !fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are fucking required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 fucking characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ rollNo }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this roll number or email already fucking exists'
            });
        }

        // Create new user
        const user = new User({
            semester,
            department,
            rollNo,
            password, // In production, hash this fucking password
            fullName,
            email
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(201).json({
            success: true,
            message: 'User created fucking successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    semester: user.semester,
                    department: user.department,
                    rollNo: user.rollNo,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this roll number or email already fucking exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server fucking error during signup'
        });
    }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { semester, department, rollNo, password } = req.body;

        console.log('Login attempt:', { semester, department, rollNo });

        // Validation
        if (!semester || !department || !rollNo || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are fucking required'
            });
        }

        // Find user
        const user = await User.findOne({ semester, department, rollNo });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid fucking credentials'
            });
        }

        // Check password
        if (password !== user.password) {
            return res.status(400).json({
                success: false,
                message: 'Invalid fucking credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.json({
            success: true,
            message: 'Login fucking successful',
            data: {
                token,
                user: {
                    id: user._id,
                    semester: user.semester,
                    department: user.department,
                    rollNo: user.rollNo,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server fucking error during login'
        });
    }
});

// Protected route example
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No fucking token provided' 
            });
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid fucking token' 
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    semester: user.semester,
                    department: user.department,
                    rollNo: user.rollNo,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid fucking token'
        });
    }
});

// 404 handler - FIXED FOR EXPRESS 5.0
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not fucking found: ' + req.method + ' ' + req.url
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server fucking error'
    });
});

// Start the fucking server
app.listen(PORT, () => {
    console.log(`✅ Server is fucking running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`✅ Make sure MongoDB is running at: ${MONGODB_URI}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Shutting down fucking server...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});
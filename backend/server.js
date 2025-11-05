const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

const MONGODB_URI = 'mongodb://127.0.0.1:27017/Combits';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
});

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

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { semester, department, rollNo, password, fullName, email } = req.body;

        if (!semester || !department || !rollNo || !password || !fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const existingUser = await User.findOne({
            $or: [{ rollNo }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this roll number or email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            semester,
            department,
            rollNo,
            password: hashedPassword,
            fullName,
            email
        });

        await user.save();

        const token = Buffer.from(JSON.stringify({
            userId: user._id,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        })).toString('base64');

        res.status(201).json({
            success: true,
            message: 'User created successfully',
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
                message: 'User with this roll number or email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { semester, department, rollNo, password } = req.body;

        if (!semester || !department || !rollNo || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({ 
            semester: semester.trim(),
            department: department.trim(), 
            rollNo: rollNo.trim()
        });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = Buffer.from(JSON.stringify({
            userId: user._id,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        })).toString('base64');

        res.json({
            success: true,
            message: 'Login successful',
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
            message: 'Server error during login'
        });
    }
});
// Add to server.js after the existing userSchema
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialHandle: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: '/DefaultPic.png'
  },
  coverImage: {
    type: String,
    default: ''
  },
  notesCount: {
    type: Number,
    default: 0
  },
  pdfCount: {
    type: Number,
    default: 0
  },
  otherCount: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['PDF', 'Note', 'Other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  favorite: {
    type: Boolean,
    default: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('Profile', profileSchema);
const Memory = mongoose.model('Memory', memorySchema);
// Profile Routes
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = await Profile.findOne({ userId: user._id });
    
    if (!profile) {
      // Create default profile if doesn't exist
      profile = new Profile({
        userId: user._id,
        username: user.rollNo,
        displayName: user.fullName,
        bio: '',
        website: '',
        socialHandle: '',
        profileImage: '/DefaultPic.png',
        coverImage: '',
        notesCount: 0,
        pdfCount: 0,
        otherCount: 0
      });
      await profile.save();
    }

    const memories = await Memory.find({ userId: user._id })
      .sort({ uploadDate: -1 });

    res.json({
      success: true,
      data: {
        profile: {
          id: profile._id,
          username: profile.username,
          displayName: profile.displayName,
          bio: profile.bio,
          website: profile.website,
          localHost: '127.0.0.1', // Static for now
          socialHandle: profile.socialHandle,
          profileImage: profile.profileImage,
          coverImage: profile.coverImage,
          notesCount: profile.notesCount,
          pdfCount: profile.pdfCount,
          otherCount: profile.otherCount,
          joinDate: user.createdAt,
          lastActive: profile.lastActive
        },
        memories: memories.map(memory => ({
          id: memory._id,
          title: memory.title,
          type: memory.type,
          description: memory.description,
          fileUrl: memory.fileUrl,
          uploadDate: memory.uploadDate,
          tags: memory.tags,
          size: memory.fileSize,
          favorite: memory.favorite
        }))
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { displayName, username, bio, website, socialHandle, profileImage, coverImage } = req.body;

    let profile = await Profile.findOne({ userId: user._id });
    
    if (!profile) {
      profile = new Profile({ userId: user._id });
    }

    if (displayName !== undefined) profile.displayName = displayName;
    if (username !== undefined) profile.username = username;
    if (bio !== undefined) profile.bio = bio;
    if (website !== undefined) profile.website = website;
    if (socialHandle !== undefined) profile.socialHandle = socialHandle;
    if (profileImage !== undefined) profile.profileImage = profileImage;
    if (coverImage !== undefined) profile.coverImage = coverImage;
    
    profile.lastActive = new Date();

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          id: profile._id,
          username: profile.username,
          displayName: profile.displayName,
          bio: profile.bio,
          website: profile.website,
          localHost: '127.0.0.1',
          socialHandle: profile.socialHandle,
          profileImage: profile.profileImage,
          coverImage: profile.coverImage,
          notesCount: profile.notesCount,
          pdfCount: profile.pdfCount,
          otherCount: profile.otherCount,
          joinDate: user.createdAt,
          lastActive: profile.lastActive
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

app.post('/api/memories', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { title, type, description, fileUrl, fileName, fileSize, tags } = req.body;

    const memory = new Memory({
      userId: user._id,
      title,
      type,
      description: description || '',
      fileUrl,
      fileName,
      fileSize,
      tags: tags || [],
      uploadDate: new Date()
    });

    await memory.save();

    // Update profile counts
    const profile = await Profile.findOne({ userId: user._id });
    if (profile) {
      if (type === 'Note') profile.notesCount += 1;
      else if (type === 'PDF') profile.pdfCount += 1;
      else profile.otherCount += 1;
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: 'Memory created successfully',
      data: {
        memory: {
          id: memory._id,
          title: memory.title,
          type: memory.type,
          description: memory.description,
          fileUrl: memory.fileUrl,
          uploadDate: memory.uploadDate,
          tags: memory.tags,
          size: memory.fileSize,
          favorite: memory.favorite
        }
      }
    });

  } catch (error) {
    console.error('Memory creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating memory'
    });
  }
});

app.patch('/api/memories/:id/favorite', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const memory = await Memory.findOne({ 
      _id: req.params.id, 
      userId: decoded.userId 
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found'
      });
    }

    memory.favorite = !memory.favorite;
    await memory.save();

    res.json({
      success: true,
      message: 'Memory updated successfully',
      data: {
        memory: {
          id: memory._id,
          favorite: memory.favorite
        }
      }
    });

  } catch (error) {
    console.error('Memory favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating memory'
    });
  }
});
// Study Session Schema
const studySessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: String,
        default: 'General'
    },
    subject: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    location: {
        type: String,
        required: true,
        enum: ['Online', 'On-Campus', 'Library', 'Other']
    },
    specificLocation: {
        type: String
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },
    currentParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    requirements: {
        type: String,
        maxlength: 200
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Community Schema
const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    icon: {
        type: String,
        default: '👥'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String
    }],
    category: {
        type: String,
        required: true,
        enum: ['Academic', 'Technical', 'Sports', 'Cultural', 'Social', 'Other']
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    memberCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Models
const StudySession = mongoose.model('StudySession', studySessionSchema);
const Community = mongoose.model('Community', communitySchema);
// Study Session Routes
app.post('/api/sessions', async (req, res) => {
    try {
        const {
            title,
            description,
            community = 'General',
            subject,
            tags = [],
            date,
            startTime,
            endTime,
            location,
            specificLocation,
            maxParticipants,
            requirements,
            isPublic = true
        } = req.body;

        // For now, create session without authentication
        // In production, you'd use authenticateToken middleware
        const session = new StudySession({
            title,
            description,
            community,
            subject,
            tags,
            date: new Date(date),
            startTime,
            endTime,
            location,
            specificLocation,
            maxParticipants,
            requirements,
            isPublic,
            currentParticipants: []
        });

        await session.save();

        res.status(201).json({
            success: true,
            message: 'Study session created successfully',
            data: { session }
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating session'
        });
    }
});

app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await StudySession.find({ isPublic: true })
            .populate('currentParticipants', 'fullName avatar rollNo')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { sessions }
        });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching sessions'
        });
    }
});

app.get('/api/sessions/ongoing', async (req, res) => {
    try {
        const sessions = await StudySession.find({
            status: 'ongoing',
            isPublic: true
        })
        .populate('currentParticipants', 'fullName avatar')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({
            success: true,
            data: { sessions }
        });
    } catch (error) {
        console.error('Get ongoing sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching ongoing sessions'
        });
    }
});

// Community Routes
app.post('/api/communities', async (req, res) => {
    try {
        const { name, description, icon, category, tags = [], isPublic = true } = req.body;

        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({
                success: false,
                message: 'Community with this name already exists'
            });
        }

        const community = new Community({
            name,
            description,
            icon,
            category,
            tags,
            isPublic,
            memberCount: 0
        });

        await community.save();

        res.status(201).json({
            success: true,
            message: 'Community created successfully',
            data: { community }
        });
    } catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating community'
        });
    }
});

app.get('/api/communities', async (req, res) => {
    try {
        const communities = await Community.find({ isPublic: true })
            .sort({ memberCount: -1 });

        res.json({
            success: true,
            data: { communities }
        });
    } catch (error) {
        console.error('Get communities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching communities'
        });
    }
});

// Simple session join endpoint
app.post('/api/sessions/:id/join', async (req, res) => {
    try {
        const session = await StudySession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // For demo purposes, just return success
        // In production, you'd add user to participants array
        res.json({
            success: true,
            message: 'Successfully joined the session'
        });
    } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error joining session'
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.method + ' ' + req.url
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
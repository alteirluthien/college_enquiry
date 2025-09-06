const express = require("express");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get("/", (req, res) => {
  res.send("🚀 College Enquiry Backend Running!");
});

// Auth endpoints
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
    
    const token = generateToken(newUser.id);
    
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Chat endpoints
app.post("/api/chat", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    
    // Save user message to database
    await prisma.chatLog.create({
      data: {
        userId,
        sender: 'user',
        message
      }
    });
    
    // Simple bot response
    let botResponse = "I'm here to help with your college enquiries! Ask me about admissions, courses, or campus life.";
    
    if (message.toLowerCase().includes('admission')) {
      botResponse = "For admissions, you typically need to submit your transcripts, application form, and may need to take an entrance exam. Would you like specific information about any program?";
    } else if (message.toLowerCase().includes('course') || message.toLowerCase().includes('program')) {
      botResponse = "We offer various programs including Engineering, Business, Arts, and Sciences. What field are you interested in?";
    } else if (message.toLowerCase().includes('fee') || message.toLowerCase().includes('cost')) {
      botResponse = "Tuition fees vary by program. Engineering programs are typically $15,000/year, Business programs $12,000/year. Financial aid is available!";
    }
    
    // Save bot response to database
    await prisma.chatLog.create({
      data: {
        userId,
        sender: 'bot',
        message: botResponse
      }
    });
    
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get("/api/chat-history", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const userChats = await prisma.chatLog.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(userChats);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    const { feedbackText, rating, userId } = req.body;
    
    if (!feedbackText || !rating) {
      return res.status(400).json({ error: 'Feedback text and rating are required' });
    }
    
    await prisma.feedback.create({
      data: {
        feedbackText,
        rating: parseInt(rating),
        userId: userId || null
      }
    });
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend files
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbots.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'faq.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

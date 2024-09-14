const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chatRoutes = require('./route/Chat');
const { setIoInstance } = require('./controller/ChatController');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for both Express and Socket.io
app.use(cors({
    origin: [
        'https://e-commerce-jesa.onrender.com',
        'https://st-adminpanel.onrender.com',
        'https://br-chatbot-backend.onrender.com',
        'http://192.168.0.105:3000',
        'http://192.168.0.167:3000',
        'http://localhost:3000',
        'http://localhost:3002',
    ],
    credentials: true,
}));

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',  // Adjust according to your frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Middleware to parse request body
app.use(express.json());

// Routes for handling chat-related HTTP requests
app.use('/chat', chatRoutes);

// Initialize Socket.io
setIoInstance(io);

app.get('/', (req, res) => {
    res.send("Socket.io Server Connected");
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Start the server
const PORT = process.env.PORT || 8090;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

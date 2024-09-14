const { v4: uuidv4 } = require('uuid');
const { Chat } = require('../model/Chats');


// Function to set and store the io instance
let ioInstance;

exports.setIoInstance = (io) => {
    ioInstance = io;
    console.log("io instance stored");
    
    // Call `connectSocket` immediately after storing the io instance
    exports.connectSocket();
}

exports.connectSocket = () => {
    if (!ioInstance) {
        console.error("io instance not found.");
        return;
    }

    try {
        // Handle Socket.io connections
        ioInstance.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            // Listen for joining a chat room
            socket.on('joinRoom', (chatRoomId) => {
                socket.join(chatRoomId);
                console.log(`User ${socket.id} joined room ${chatRoomId}`);
            });

            // Listen for leaving a chat room
            socket.on('leaveRoom', (chatRoomId) => {
                socket.leave(chatRoomId);
                console.log(`User ${socket.id} left room ${chatRoomId}`);
            });

            // Handle user message
            socket.on('userMessage', async ({ chatRoomId, message }) => {
                ioInstance.to(chatRoomId).emit('newMessage', message);

                // Save the user message to the database
                const userMsg = message.text;
                const userMsgTime = new Date();

                try {
                    let chatRoom = await Chat.findOne({ chatRoomId });
                    if (!chatRoom) {
                        chatRoom = new Chat({ chatRoomId });
                    }

                    chatRoom.userMsgData.push({
                        userId: socket.id,
                        userMsg,
                        userMsgTime,
                    });

                    await chatRoom.save();
                    console.log('Message saved to database:', userMsg);
                } catch (error) {
                    console.error('Error saving message to database:', error);
                }
            });

            // Handle admin message
            socket.on('adminMessage', async ({ chatRoomId, message }) => {
                ioInstance.to(chatRoomId).emit('newMessage', message);

                const adminMsg = message.text;
                const adminMsgTime = new Date();

                try {
                    let chatRoom = await Chat.findOne({ chatRoomId });
                    if (!chatRoom) {
                        chatRoom = new Chat({ chatRoomId });
                    }

                    chatRoom.adminMsgData.push({
                        adminId: `admin_${socket.id}`,
                        adminMsg,
                        adminMsgTime,
                    });

                    await chatRoom.save();
                    console.log('Admin message saved to database:', adminMsg);
                } catch (error) {
                    console.error('Error saving admin message to database:', error);
                }
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

    } catch (error) {
        console.error("Something went wrong while connecting to socket:", error);
    }
};

exports.startChat = (req, res) => {
    try {
        // Generate a unique chat room ID
        const chatRoomId = uuidv4();
        res.status(200).json({ chatRoomId });

    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ message: 'Failed to start chat' });
    }
};



exports.fetchChat = async (req, res) => {
    const { chatRoomId } = req.params; // Get chatRoomId from URL parameters

    try {
        // Find the chat room by chatRoomId
        const chatRoom = await Chat.findOne({ chatRoomId });

        if (!chatRoom) {
            return res.status(404).json({
                success: false,
                message: "Chat room not found.",
            });
        }

        // Check if there is at least one user message
        if (chatRoom.userMsgData.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No user messages found.",
                firstUserMessage: null,
            });
        }

        // Get the first user message
        const firstUserMessage = chatRoom.userMsgData[0];

        // Return the first user message
        res.status(200).json({
            success: true,
            firstUserMessage: {
                userId: firstUserMessage.userId,
                text: firstUserMessage.userMsg,
                timestamp: firstUserMessage.userMsgTime,
            },
        });

    } catch (error) {
        console.error('Error fetching the first user message:', error);
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            response: "Internal server error",
        });
    }
};




// Controller to fetch all chat rooms
exports.fetchAllChatRooms = async (req, res) => {
    try {
        // Fetch all chat rooms
        const chatRooms = await Chat.find({}); // Assuming Chat model stores chat rooms

        // Return the chat rooms as a response
        res.status(200).json({
            success: true,
            response: "Chat rooms fetched successfully",
            chatRooms: chatRooms
        });
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({
            success: false,
            response: "Internal server error",
            message: "Something went wrong"
        });
    }
};

// Controller to fetch a chat room by ID
exports.fetchChatRoomById = async (req, res) => {
    try {
        const { chatRoomId } = req.params; // Get the chat room ID from the request params

        // Fetch the chat room by its ID
        const chatRoom = await Chat.findById(chatRoomId);

        // Check if chat room exists
        if (!chatRoom) {
            return res.status(404).json({
                success: false,
                response: "Chat room not found",
                message: `No chat room found with ID: ${chatRoomId}`
            });
        }

        // Return the chat room details as a response
        res.status(200).json({
            success: true,
            response: "Chat room fetched successfully",
            chatRoom: chatRoom
        });
    } catch (error) {
        console.error("Error fetching chat room by ID:", error);
        res.status(500).json({
            success: false,
            response: "Internal server error",
            message: "Something went wrong"
        });
    }
}

// Controller to delete all chat data
exports.deleteAllChat = async (req, res) => {
    try {
        // Delete all documents from the Chat collection
        await Chat.deleteMany({});

        // Respond with success
        res.status(200).json({
            success: true,
            response: "All chat data deleted successfully",
            message: "Chat data has been cleared"
        });
    } catch (error) {
        console.error("Error deleting all chat data:", error);
        res.status(500).json({
            success: false,
            response: "Something went wrong",
            message: "Internal server error"
        });
    }
};



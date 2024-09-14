const express = require('express');
const { startChat, fetchChat, fetchAllChatRooms, fetchChatRoomById, deleteAllChat, connectSocket } = require('../controller/ChatController');

const router = express.Router();



router.post('/start-chat', startChat)// Route to start a new chat room
    .post('/receive-msg/:chatRoomId', fetchChat)
    .get('/fetch-chat-rooms',fetchAllChatRooms)
    .get('/fetch-chat-rooms/:chatRoomId',fetchChatRoomById)
    .delete('/delete',deleteAllChat)
    .post('/:chatRoomId',connectSocket)



module.exports = router;

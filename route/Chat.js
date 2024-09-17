const express = require('express');
const { startChat, fetchChat, fetchAllChatRooms, fetchChatRoomById, deleteAllChat, connectSocket } = require('../controller/ChatController');
const { isAdmin } = require('../middlewares/isAdmin');
const { isValid } = require('../middlewares/isValid');

const router = express.Router();



router.post('/start-chat', startChat)// Route to start a new chat room
    .post('/receive-msg/:chatRoomId',isAdmin, fetchChat)
    .get('/fetch-chat-rooms',isAdmin,fetchAllChatRooms)
    .get('/fetch-chat-rooms/:chatRoomId',isAdmin,fetchChatRoomById)
    .delete('/delete',isAdmin,deleteAllChat)
    .post('/:chatRoomId',isAdmin,connectSocket)



module.exports = router;

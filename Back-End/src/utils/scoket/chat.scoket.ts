import { Server, Socket } from 'socket.io';
 import { MessageRepository } from '../../repositories/message/message.repository';
// import { Types } from 'mongoose';
// import { ChatRepository } from '../../repositories/chat/chat.repository';
 const messageRepo = new MessageRepository(); 
// // const chatRepo = new ChatRepository();



let onlineUsers: { [userId: string]: { socketId: string; role: 'patient' | 'doctor' } } = {};

export function initChatSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (appointmentId: string) => {
      socket.join(appointmentId);
      console.log(`User joined appointment room: ${appointmentId}`);
    });

    socket.on('addUser', ({ userId, role }) => {
      console.log(`User ${userId} (${role}) joined`);
      onlineUsers[userId] = { socketId: socket.id, role };
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (let userId in onlineUsers) {
        if (onlineUsers[userId].socketId === socket.id) {
          delete onlineUsers[userId];
        }
      }
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('typing', ({ chatId, sender }) => {
      socket.to(chatId).emit('typing', { chatId, sender });
    });

    socket.on('stopTyping', ({ chatId, sender }) => {
      socket.to(chatId).emit('stopTyping', { chatId, sender });
    });

    socket.on('deleteMessage',async({messageId,chatId})=>{
      try {
        await messageRepo.findByIdAndDelete(messageId);
        io.to(chatId).emit('messageDeleted',messageId);
      } catch (error) {
        console.log('message delete error',error);
      }
    });

    socket.on('sendMessage', async (messageData) => {
      try {
        io.to(messageData.chatId).emit('receiveMessage', messageData);

        io.to(messageData.chatId).emit('updateConversation', {
          chatId: messageData.chatId,
          lastMessage: {
            content: messageData?.content || '',
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });


  });
}

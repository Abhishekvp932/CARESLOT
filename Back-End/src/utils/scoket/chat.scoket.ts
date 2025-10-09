import { Server, Socket } from 'socket.io';
 import { MessageRepository } from '../../repositories/message/message.repository';

 const messageRepo = new MessageRepository(); 


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

    socket.on('markAsRead', async ({ chatId, userId }) => {
  
    await messageRepo.findByChatIdAndUpdate(
      { chatId, sender: { $ne: userId }, read: false },
      { $set: { read: true } }
    );

  io.to(socket.id).emit('messagesRead', { chatId });
});


   socket.on('sendMessage', async (messageData) => {
  try {
   
    io.to(messageData.chatId).emit('receiveMessage', messageData);

    const roomSockets = await io.in(messageData.chatId).fetchSockets();

    roomSockets.forEach((s) => {
      if (s.id === socket.id) {
        io.to(s.id).emit('updateConversation', {
          chatId: messageData.chatId,
          lastMessage: {
            content: messageData?.content || '',
            timestamp: new Date().toISOString(),
            sender: messageData.sender,
          },
          unreadIncrement: 0,  
        });
      } else {
        io.to(s.id).emit('updateConversation', {
          chatId: messageData.chatId,
          lastMessage: {
            content: messageData?.content || '',
            timestamp: new Date().toISOString(),
            sender: messageData.sender,
          },
          unreadIncrement: 1,
        });
      }
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
});


  });
}

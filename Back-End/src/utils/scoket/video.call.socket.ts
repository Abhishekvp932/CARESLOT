import { Server, Socket } from 'socket.io';
import logger from '../logger';

interface JoinRoomPayload { 
  appointmentId: string; 
  userId: string; 
}

interface StartCallPayload { 
  appointmentId: string; 
  offer: RTCSessionDescriptionInit; 
  to: string;
  from: string;
}

interface AcceptCallPayload { 
  appointmentId: string; 
  answer: RTCSessionDescriptionInit; 
  to: string; 
}

interface RejectCallPayload { 
  appointmentId: string; 
  to: string; 
}

interface EndCallPayload { 
  appointmentId: string; 
  to: string; 
}

interface IceCandidatePayload { 
  appointmentId: string; 
  candidate: RTCIceCandidateInit; 
  to: string; 
}


const userSocketMap = new Map<string, string>();

export const initVideoCallSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
  

    socket.on('join-room', ({ appointmentId, userId }: JoinRoomPayload) => {
      
      userSocketMap.set(userId, socket.id);
      socket.data.userId = userId;
      socket.data.appointmentId = appointmentId;
      
      socket.join(appointmentId);
      logger.info(`User ${userId} (socket: ${socket.id}) joined video call room ${appointmentId}`);
      
      const clients = Array.from(io.sockets.adapter.rooms.get(appointmentId) || []);
      const otherSocketId = clients.find(id => id !== socket.id);
      
      if (otherSocketId) {
        const otherSocket = io.sockets.sockets.get(otherSocketId);
        const otherUserId = otherSocket?.data.userId;
        
        logger.info(`Notifying both users - Current: ${userId}, Other: ${otherUserId}`);
        
      
        socket.emit('user-already-in-room', { 
          userId: otherUserId, 
          socketId: otherSocketId 
        });
    
        socket.to(otherSocketId).emit('user-joined', { 
          userId: userId, 
          socketId: socket.id 
        });
      }
    });

   
    socket.on('start-call', ({ offer, to, from, appointmentId }: StartCallPayload) => {
      const targetSocketId = userSocketMap.get(to);
      
      if (targetSocketId) {
        logger.info(`Call started from ${from} (${socket.id}) to ${to} (${targetSocketId}),appoinmentId${appointmentId}`);
        io.to(targetSocketId).emit('incoming-call', { 
          from: socket.id, 
          fromUserId: from,
          offer 
        });
      } else {
        logger.error(`User ${to} not found in socket map. Available users:`, Array.from(userSocketMap.keys()));
        socket.emit('call-failed', { reason: 'User not available or not in the room' });
      }
    });

    
    socket.on('accept-call', ({ answer, to, appointmentId }: AcceptCallPayload) => {
      logger.info(`Call accepted by ${socket.id}, sending answer to ${to},appoinmentId${appointmentId}`);
      io.to(to).emit('call-accepted', { 
        answer, 
        from: socket.id 
      });
    });

    
    socket.on('reject-call', ({ to, appointmentId }: RejectCallPayload) => {
      logger.info(`Call rejected by ${socket.id}, notifying ${to},appoinmentId${appointmentId}`);
      io.to(to).emit('call-rejected', { from: socket.id });
    });

   
    socket.on('end-call', ({ to, appointmentId }: EndCallPayload) => {
      logger.info(`Call ended by ${socket.id}, notifying ${to},appoinmentId${appointmentId}`);
      io.to(to).emit('call-ended', { from: socket.id });
    });

   
    socket.on('ice-candidate', ({ candidate, to, appointmentId }: IceCandidatePayload) => {
      logger.info(`ICE candidate from ${socket.id} to ${to},appoinmentId${appointmentId}`);
      io.to(to).emit('ice-candidate', { 
        candidate, 
        from: socket.id 
      });
    });

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      const appointmentId = socket.data.appointmentId;
      
      if (userId) {
        userSocketMap.delete(userId);
        logger.info(`User ${userId} (socket: ${socket.id}) disconnected`);
      }
      
     
      if (appointmentId) {
        socket.to(appointmentId).emit('user-disconnected', { 
          userId: userId,
          socketId: socket.id 
        });
      }
    });
  });
};
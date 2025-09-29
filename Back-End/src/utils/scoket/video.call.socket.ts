import { Server, Socket } from 'socket.io';

interface JoinRoomPayload { appointmentId: string; userId: string; }
interface CallUserPayload { appointmentId: string; offer: RTCSessionDescriptionInit; to: string; }
interface AnswerCallPayload { appointmentId: string; answer: RTCSessionDescriptionInit; to: string; }
interface IceCandidatePayload { appointmentId: string; candidate: RTCIceCandidateInit; to: string; }

export const initVideoCallSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ appointmentId }: JoinRoomPayload) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(appointmentId) || []);
      const otherClientId = clients.find(id => id !== socket.id);
      socket.join(appointmentId);

      if (otherClientId) {
        socket.emit('user-already-in-room', { userId: otherClientId });
        socket.to(otherClientId).emit('user-joined', { userId: socket.id });
      }
    });

    socket.on('call-user', ({ offer, to }: CallUserPayload) => {
      socket.to(to).emit('receive-call', { from: socket.id, offer });
    });

    socket.on('answer-call', ({ answer, to }: AnswerCallPayload) => {
      socket.to(to).emit('call-answered', { answer });
    });

    socket.on('ice-candidate', ({ candidate, to }: IceCandidatePayload) => {
      socket.to(to).emit('ice-candidate', { candidate });
    });

    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
  });
};

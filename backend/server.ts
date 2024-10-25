import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

interface Room {
  id: number;
  name: string;
  clients: string[];
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permitir requisições de qualquer origem para teste; ajuste conforme necessário.
  },
});

let rooms: Room[] = [];

// Rota simples para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor Socket.IO com Express está rodando!');
});

// Gerencia as conexões de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Evento para criar uma sala
  socket.on('create-room', () => {
    const newRoom: Room = {
      id: rooms.length + 1,
      name: `Sala ${rooms.length + 1}`,
      clients: [],
    };
    rooms.push(newRoom);
    io.emit('rooms', rooms); // Envia a lista de salas para todos os clientes conectados
  });

  // Evento para entrar em uma sala
  socket.on('join-room', ({ roomId, clientName }) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && clientName) {
      room.clients.push(clientName);
      io.emit('rooms', rooms); // Atualiza e envia a lista de salas para todos os clientes
    }
  });

  // Evento para desconectar o cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Inicia o servidor HTTP com Express
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
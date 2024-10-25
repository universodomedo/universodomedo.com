import { io, Socket } from 'socket.io-client';

interface Room {
    id: number;
    name: string;
    clients: string[];
}

// socket.emit - para o client especifico

// socket.broadcast.emit - para todos os clients, menos o especifico

// io.emit - para todos os clients

type MessageHandler = (data: any) => void;

class SocketIOService {
    private socket: Socket;
    private handlers: Record<string, MessageHandler[]> = {};

    constructor(url: string) {
        this.socket = io(url, { autoConnect: false });

        try {
            this.socket.connect();
        } catch (error) {
            console.warn('[SocketIOService] Não foi possível conectar ao servidor:', error);
        }

        this.socket.on('connect', () => {
            console.log('[SocketIOService] Conexão estabelecida:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.warn('[SocketIOService] Conexão perdida');
        });

        this.socket.on('connect_error', (error) => {
            console.warn('[SocketIOService] Falha ao conectar ao servidor. Verifique se o servidor está ativo.');
            console.debug('[SocketIOService] Detalhes do erro de conexão:', error.message);
        });

        this.socket.onAny((event, data) => {
            console.log(`[SocketIOService] Mensagem recebida (${event}):`, data);
            this.handleMessage(event, data);
        });
    }

    // Enviar mensagens com eventos específicos
    emit(event: string, payload: any) {
        console.log(`[SocketIOService] Enviando mensagem (${event}):`, payload);
        this.socket.emit(event, payload);
    }

    // Adiciona um handler para um tipo específico de evento
    addMessageHandler(event: string, handler: MessageHandler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    // Remove um handler para um tipo específico de evento
    removeMessageHandler(event: string, handler: MessageHandler) {
        if (!this.handlers[event]) return;
        this.handlers[event] = this.handlers[event].filter((h) => h !== handler);
    }

    // Processa mensagens recebidas e chama handlers registrados
    private handleMessage(event: string, data: any) {
        if (this.handlers[event]) {
            this.handlers[event].forEach((handler) => handler(data));
        } else {
            console.warn('[SocketIOService] Nenhum handler para o evento:', event);
        }
    }
}

export default SocketIOService;
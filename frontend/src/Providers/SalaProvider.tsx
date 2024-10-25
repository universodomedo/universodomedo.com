// #region Imports
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import SocketIOService from 'Servicos/SocketIOService.ts';
// #endregion

interface Sala {
    id: number;
    name: string;
    clients: string[];
}

interface SalaContextProps {
    salas: Sala[];
    criaSala: () => void;
    entraSala: (idSala: number, clientName: string) => void;
}

const SalaContext = createContext<SalaContextProps | undefined>(undefined);

const socketService = new SocketIOService('http://localhost:8080');

export const SalaProvider = ({ children }: { children: ReactNode }) => {
    const [salas, setSalas] = useState<Sala[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        socketService.addMessageHandler('salas', (data) => {
            setSalas(data.salas);
        });

        return () => {
            socketService.removeMessageHandler('salas', (data) => {
                setSalas(data.salas);
            });
        };
    }, []);

    const criaSala = () => {
        socketService.emit('cria-sala', {});
    };

    const entraSala = (idSala: number, clientName: string) => {
        socketService.emit('entra-sala', { idSala, clientName });
    };

    return (
        <SalaContext.Provider value={{ salas, criaSala, entraSala }}>
            {children}
        </SalaContext.Provider>
    );
};

export const useSalaContext = () => {
    const context = useContext(SalaContext);
    if (!context) {
        throw new Error('useSalaContext must be used within a SalaProvider');
    }
    return context;
};
'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Contexto__Chat__Props {
    chatVisivel: boolean;
    tornaChatInivisivel: () => void;
    chatAberto: boolean;
    abrirChat: () => void;
    fecharChat: () => void;
};

const Contexto__Chat = createContext<Contexto__Chat__Props | undefined>(undefined);

export const useContexto__Chat = (): Contexto__Chat__Props => {
    const context = useContext(Contexto__Chat);
    if (!context) throw new Error('useContexto__Chat precisa estar dentro de um Contexto__Chat');
    return context;
};

export const Contexto__Chat__Provider = ({ children }: { children: React.ReactNode }) => {
    const [chatVisivel, setChatVisivel] = useState<boolean>(true);
    const [chatAberto, setChatAberto] = useState<boolean>(false);

    function tornaChatInivisivel() { setChatVisivel(false); };
    const abrirChat = useCallback(() => setChatAberto(true), []);
    const fecharChat = useCallback(() => setChatAberto(false), []);

    return (
        <Contexto__Chat.Provider value={{ chatVisivel, tornaChatInivisivel, chatAberto, abrirChat, fecharChat }}>
            {children}
        </Contexto__Chat.Provider>
    );
};
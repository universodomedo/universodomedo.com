'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Contexto__Chat__Props {
    chatVisivel: boolean;
    tornaChatInivisivel: () => void;
};

const Contexto__Chat = createContext<Contexto__Chat__Props | undefined>(undefined);

export const useContexto__Chat = (): Contexto__Chat__Props => {
    const context = useContext(Contexto__Chat);
    if (!context) throw new Error('useContexto__Chat precisa estar dentro de um Contexto__Chat');
    return context;
};

export const Contexto__Chat__Provider = ({ children }: { children: React.ReactNode }) => {
    const [chatVisivel, setChatVisivel] = useState<boolean>(true);

    function tornaChatInivisivel() { setChatVisivel(false); };

    return (
        <Contexto__Chat.Provider value={{ chatVisivel, tornaChatInivisivel }}>
            {children}
        </Contexto__Chat.Provider>
    );
};
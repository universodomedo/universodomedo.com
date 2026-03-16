'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { RegistroSessaoSelecionadaParaAssistir } from 'Contextos/ContextoPaginaAssistir/contexto';
import SPA__PaginaAssistir__SessaoSelecionada from 'Conteineres/PaginaAssistir/paginas/SPA__PaginaAssistir__SessaoSelecionada/SPA__PaginaAssistir__SessaoSelecionada';

interface ContextoPaginaAssistir__SessaoSelecionadaProps {
    
};

const ContextoPaginaAssistir__SessaoSelecionada = createContext<ContextoPaginaAssistir__SessaoSelecionadaProps | undefined>(undefined);

export const useContextoPaginaAssistir__SessaoSelecionada = (): ContextoPaginaAssistir__SessaoSelecionadaProps => {
    const context = useContext(ContextoPaginaAssistir__SessaoSelecionada);
    if (!context) throw new Error('useContextoPaginaAssistir__SessaoSelecionada precisa estar dentro de um ContextoPaginaAssistir__SessaoSelecionada');
    return context;
};

export const ContextoPaginaAssistir__SessaoSelecionadaProvider = ({ registroSessaoSelecionada }: { registroSessaoSelecionada: RegistroSessaoSelecionadaParaAssistir; }) => {

    return (
        <ContextoPaginaAssistir__SessaoSelecionada.Provider value={{  }}>
            <SPA__PaginaAssistir__SessaoSelecionada />
        </ContextoPaginaAssistir__SessaoSelecionada.Provider>
    );
};
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraParaAssistirDto } from 'types-nora-api';

import SPA__MenuAssistir__MenuInicial from 'Conteineres/MenuAssistir/paginas/SPA__MenuAssistir__MenuInicial/SPA__MenuAssistir__MenuInicial';

interface ContextoMenuAssistirProps {
    aventuras: AventuraParaAssistirDto[];
};

const ContextoMenuAssistir = createContext<ContextoMenuAssistirProps | undefined>(undefined);

export const useContextoMenuAssistir = (): ContextoMenuAssistirProps => {
    const context = useContext(ContextoMenuAssistir);
    if (!context) throw new Error('useContextoMenuAssistir precisa estar dentro de um ContextoMenuAssistir');
    return context;
};

export const ContextoMenuAssistirProvider = ({ aventuras }: { aventuras: AventuraParaAssistirDto[] }) => {

    return (
        <ContextoMenuAssistir.Provider value={{ aventuras }}>
            <SPA__MenuAssistir__MenuInicial />
        </ContextoMenuAssistir.Provider>
    );
};
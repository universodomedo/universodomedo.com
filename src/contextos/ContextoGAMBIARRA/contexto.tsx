'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { rodarTesteEndPoint } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoGAMBIARRAProps {
    rodarTeste: () => {};
};

const ContextoGAMBIARRA = createContext<ContextoGAMBIARRAProps | undefined>(undefined);

export const useContextoGAMBIARRA = (): ContextoGAMBIARRAProps => {
    const context = useContext(ContextoGAMBIARRA);
    if (!context) throw new Error('useContextoGAMBIARRA precisa estar dentro de um ContextoGAMBIARRA');
    return context;
};

export const ContextoGAMBIARRAProvider = ({ children }: { children: React.ReactNode }) => {
    async function rodarTeste() {
        console.log(await rodarTesteEndPoint());
    }

    return (
        <ContextoGAMBIARRA.Provider value={{ rodarTeste }}>
            {children}
        </ContextoGAMBIARRA.Provider>
    );
};
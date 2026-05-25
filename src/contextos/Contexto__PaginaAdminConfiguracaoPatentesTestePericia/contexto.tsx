'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ConfiguracaoPatentesTestePericiaProjetada, PatentePericiaCompletaDto } from 'types-nora-api';

import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';

export interface Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props {
    configuracaoInicial: ConfiguracaoPatentesTestePericiaProjetada | null;
    patentes: PatentePericiaCompletaDto[];
};

const Contexto__PaginaAdminConfiguracaoPatentesTestePericia = createContext<Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props | undefined>(undefined);

export const useContexto__PaginaAdminConfiguracaoPatentesTestePericia = (): Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props => {
    const context = useContext(Contexto__PaginaAdminConfiguracaoPatentesTestePericia);
    if (!context) throw new Error('useContexto__PaginaAdminConfiguracaoPatentesTestePericia precisa estar dentro de um Contexto__PaginaAdminConfiguracaoPatentesTestePericia');
    return context;
};

export const Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Provider = ({ children }: { children: ReactNode; }) => {
    const cache = useAppSelector(selectCache);
    const configuracaoInicial = cache?.configuracaoPatentesTestePericia ?? null;
    const patentes = cache?.patentesPericia ?? [];

    return (
        <Contexto__PaginaAdminConfiguracaoPatentesTestePericia.Provider value={{ configuracaoInicial, patentes }}>
            {children}
        </Contexto__PaginaAdminConfiguracaoPatentesTestePericia.Provider>
    );
};
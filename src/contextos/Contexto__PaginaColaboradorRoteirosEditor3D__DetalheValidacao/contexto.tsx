'use client';

import { createContext, useContext } from 'react';

import type { DetalheValidacaoRoteiroEditor3D } from '../Contexto__PaginaColaboradorRoteirosEditor3D/contexto';
import SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao from 'Conteineres/PaginaColaboradorRoteirosEditor3D/paginas/SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao/SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao';

type Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Props = {
    detalhe: DetalheValidacaoRoteiroEditor3D;
};

const Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao = createContext<Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao = (): Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Props => {
    const context = useContext(Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao);
    if (!context) throw new Error('useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao precisa estar dentro de um Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao');
    return context;
};

// Layout contextual (subtítulo/fecharProps) é dirigido pelo contexto geral (dono único); este subfluxo só apresenta.
export const Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Provider = (props: Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Props) => {
    return (
        <Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao.Provider value={props}>
            <SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao />
        </Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao.Provider>
    );
};
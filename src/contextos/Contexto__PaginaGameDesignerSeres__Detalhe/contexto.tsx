'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Detalhe from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Detalhe/SPA__PaginaGameDesignerSeres__Detalhe';

interface Contexto__PaginaGameDesignerSeres__Detalhe__Props {
    idSerSelecionado: number;
};

type PropsProvider = {
    idSerSelecionado: Contexto__PaginaGameDesignerSeres__Props['idSerSelecionado'];
    voltaParaListagem: Contexto__PaginaGameDesignerSeres__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerSeres__Detalhe = createContext<Contexto__PaginaGameDesignerSeres__Detalhe__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Detalhe = (): Contexto__PaginaGameDesignerSeres__Detalhe__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Detalhe);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Detalhe precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Detalhe');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Detalhe__Provider = ({ idSerSelecionado, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Detalhe do Ser', fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    if (idSerSelecionado === null) return null;

    return (
        <Contexto__PaginaGameDesignerSeres__Detalhe.Provider value={{ idSerSelecionado }}>
            <SPA__PaginaGameDesignerSeres__Detalhe />
        </Contexto__PaginaGameDesignerSeres__Detalhe.Provider>
    );
};

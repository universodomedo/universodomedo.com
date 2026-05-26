'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorHabilidadesPericia__Props } from '../Contexto__PaginaModeradorHabilidadesPericia/contexto';
import SPA__PaginaModeradorHabilidadesPericia__Detalhe from 'Conteineres/PaginaModeradorHabilidadesPericia/paginas/SPA__PaginaModeradorHabilidadesPericia__Detalhe/SPA__PaginaModeradorHabilidadesPericia__Detalhe';

interface Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Props {
    habilidade: NonNullable<Contexto__PaginaModeradorHabilidadesPericia__Props['habilidadeSelecionada']>;
};

const Contexto__PaginaModeradorHabilidadesPericia__Detalhe = createContext<Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesPericia__Detalhe = (): Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesPericia__Detalhe);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesPericia__Detalhe precisa estar dentro de um Contexto__PaginaModeradorHabilidadesPericia__Detalhe');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Provider = ({ habilidade, deselecionaHabilidade }: { habilidade: Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Props['habilidade']; deselecionaHabilidade: Contexto__PaginaModeradorHabilidadesPericia__Props['deselecionaHabilidade']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: habilidade.nome, fecharProps: { tipo: 'acao', executar: deselecionaHabilidade, tituloTooltip: 'Voltar para Listagem' } });

    return (
        <Contexto__PaginaModeradorHabilidadesPericia__Detalhe.Provider value={{ habilidade }}>
            <SPA__PaginaModeradorHabilidadesPericia__Detalhe />
        </Contexto__PaginaModeradorHabilidadesPericia__Detalhe.Provider>
    );
};
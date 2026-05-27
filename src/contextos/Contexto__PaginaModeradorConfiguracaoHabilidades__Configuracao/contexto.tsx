'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Props } from '../Contexto__PaginaModeradorConfiguracaoHabilidades/contexto';
import SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao from 'Conteineres/PaginaModeradorConfiguracaoHabilidades/paginas/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao';

interface Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props {
    habilidade: NonNullable<Contexto__PaginaModeradorConfiguracaoHabilidades__Props['habilidadeSelecionada']>;
};

const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = createContext<Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = (): Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Provider = ({ habilidade, deselecionaHabilidade }: { habilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props['habilidade']; deselecionaHabilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Props['deselecionaHabilidade']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: habilidade.nome, fecharProps: { tipo: 'acao', executar: deselecionaHabilidade, tituloTooltip: 'Voltar para Listagem' } });

    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider value={{ habilidade }}>
            <SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao />
        </Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider>
    );
};
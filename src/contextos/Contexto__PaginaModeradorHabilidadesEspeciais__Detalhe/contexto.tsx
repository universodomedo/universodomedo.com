'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorHabilidadesEspeciais__Props } from '../Contexto__PaginaModeradorHabilidadesEspeciais/contexto';
import SPA__PaginaModeradorHabilidadesEspeciais__Detalhe from 'Conteineres/PaginaModeradorHabilidadesEspeciais/paginas/SPA__PaginaModeradorHabilidadesEspeciais__Detalhe/SPA__PaginaModeradorHabilidadesEspeciais__Detalhe';

interface Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Props {
    habilidade: NonNullable<Contexto__PaginaModeradorHabilidadesEspeciais__Props['habilidadeSelecionada']>;
};

const Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe = createContext<Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesEspeciais__Detalhe = (): Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesEspeciais__Detalhe precisa estar dentro de um Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Provider = ({ habilidade, deselecionaHabilidade }: { habilidade: Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Props['habilidade']; deselecionaHabilidade: Contexto__PaginaModeradorHabilidadesEspeciais__Props['deselecionaHabilidade']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: habilidade.habilidade.nome, fecharProps: { tipo: 'acao', executar: deselecionaHabilidade, tituloTooltip: 'Voltar para Listagem' } });

    return (
        <Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe.Provider value={{ habilidade }}>
            <SPA__PaginaModeradorHabilidadesEspeciais__Detalhe />
        </Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe.Provider>
    );
};

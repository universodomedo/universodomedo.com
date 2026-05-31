'use client';

import { createContext, useContext } from 'react';
import type { AcaoDisponivel, FichaEmClient, Habilidade, J_DadosFichaEmJogo, ModificadorRuntime } from 'types-nora-api';

import { useFichaDeJogo } from 'Hooks/useFichaDeJogo';

interface ContextoFichaDePersonagemProps {
    ficha: FichaEmClient;
    habilidades: Habilidade[];
    acoes: AcaoDisponivel[];
    acoesPorStatusECapacidade: AcoesPorStatusECapacidade;
    modificadoresAtivos: ModificadorRuntime[];
    desativarAcoes: boolean;
};

export type GrupoAcoesPorCapacidadeFicha = {
    capacidadeExibicao: AcaoDisponivel['capacidadeExibicao'];
    acoes: AcaoDisponivel[];
};

export type AcoesPorStatusECapacidade = {
    realizaveis: GrupoAcoesPorCapacidadeFicha[];
    bloqueadas: GrupoAcoesPorCapacidadeFicha[];
};

const ContextoFichaDePersonagem = createContext<ContextoFichaDePersonagemProps | undefined>(undefined);

export const useContextoFichaDePersonagem = (): ContextoFichaDePersonagemProps => {
    const context = useContext(ContextoFichaDePersonagem);
    if (!context) throw new Error('useContextoFichaDePersonagem precisa estar dentro de um ContextoFichaDePersonagem');
    return context;
};

export const ContextoFichaDePersonagemProvider = ({ children, JDadosFichaEmJogo, desativarAcoes }: { children:React.ReactNode; JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; }) => {
    const { ficha, carregando, erro } = useFichaDeJogo(JDadosFichaEmJogo);
    const acoesPorStatusECapacidade = agrupaAcoesPorStatusECapacidade(JDadosFichaEmJogo.acoes);

    if (carregando) return <h2>Carregando ficha...</h2>;
    if (erro || !ficha) return <h2>{erro ?? 'Erro ao montar ficha'}</h2>;

    return (
        <ContextoFichaDePersonagem.Provider value={{ ficha, habilidades: JDadosFichaEmJogo.habilidades, acoes: JDadosFichaEmJogo.acoes, acoesPorStatusECapacidade, modificadoresAtivos: JDadosFichaEmJogo.modificadoresAtivos, desativarAcoes }}>
            {children}
        </ContextoFichaDePersonagem.Provider>
    );
};

function agrupaAcoesPorStatusECapacidade(acoes: AcaoDisponivel[]): AcoesPorStatusECapacidade {
    return {
        realizaveis: agrupaAcoesPorCapacidade(acoes.filter(acao => acao.habilitado)),
        bloqueadas: agrupaAcoesPorCapacidade(acoes.filter(acao => !acao.habilitado)),
    };
};

function agrupaAcoesPorCapacidade(acoes: AcaoDisponivel[]): GrupoAcoesPorCapacidadeFicha[] {
    const gruposPorCapacidade = new Map<string, GrupoAcoesPorCapacidadeFicha>();

    for (const acao of acoes) {
        const grupoExistente = gruposPorCapacidade.get(acao.capacidadeExibicao.key);

        if (grupoExistente) {
            grupoExistente.acoes.push(acao);
            continue;
        };

        gruposPorCapacidade.set(acao.capacidadeExibicao.key, { capacidadeExibicao: acao.capacidadeExibicao, acoes: [acao] });
    };

    return [...gruposPorCapacidade.values()].sort((grupoA, grupoB) => {
        const ordem = grupoA.capacidadeExibicao.ordem - grupoB.capacidadeExibicao.ordem;
        if (ordem !== 0) return ordem;
        return grupoA.capacidadeExibicao.nome.localeCompare(grupoB.capacidadeExibicao.nome);
    });
};

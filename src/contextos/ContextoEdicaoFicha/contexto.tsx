'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DadosEvolucaoFicha, DetalheEvolucao, FichaDeJogo, ObjetoGanhosEvolucao, PAGINAS } from 'types-nora-api'

import { obtemGanhosAposSelecaoClasse, obtemGanhosParaCriarFicha_FichaTemporaria, obtemGanhosParaEvoluirPorIdFicha } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { SPA_EdicaoFicha } from 'Contextos/ContextoEdicaoFicha_GanhosCarregados/contexto';
import { GanhosEvolucao } from './classes';
import { toast } from 'Hooks/useToast';
import { QUERY_PARAMS } from 'Constantes/parametros_query';


export type RecipienteEdicaoFichaProps =
    { metodoSairEvolucaoFicha: () => void; metodoSalvarFicha: (dadosEvolucaoFicha: DadosEvolucaoFicha) => Promise<number>; } &
    ({ metodo: 'CRIANDO_FICHA_TEMPORARIA'; nomeFicha: string; descricaoFicha: string; } | { metodo: 'CRIANDO_PERSONAGEM'; idPersonagem: number; });

interface ContextoEdicaoFichaProps {
    ganhos: GanhosEvolucao;
};

const ContextoEdicaoFicha = createContext<ContextoEdicaoFichaProps | undefined>(undefined);

export const useContextoEdicaoFicha = (): ContextoEdicaoFichaProps => {
    const context = useContext(ContextoEdicaoFicha);
    if (!context) throw new Error('useContextoEdicaoFicha precisa estar dentro de um ContextoEdicaoFicha');
    return context;
};

export function RecipienteEdicaoFicha({ recipienteEdicaoFichaProps }: { recipienteEdicaoFichaProps: RecipienteEdicaoFichaProps }) { return <ContextoEdicaoFichaProvider recipienteEdicaoFichaProps={recipienteEdicaoFichaProps} /> };

const ContextoEdicaoFichaProvider = ({ recipienteEdicaoFichaProps }: { recipienteEdicaoFichaProps: RecipienteEdicaoFichaProps }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [ganhos, setGanhos] = useState<GanhosEvolucao | null>(null);

    function criarMetodoSalvarEvolucao(salvarEvolucao: (dadosEvolucaoFicha: DadosEvolucaoFicha) => Promise<number>): (dadosEvolucaoFicha: DadosEvolucaoFicha) => Promise<void> {
        return async (dadosEvolucaoFicha: DadosEvolucaoFicha) => {
            try {
                const idFichaTemporariaSala = await salvarEvolucao(dadosEvolucaoFicha);
                await toast.sucesso('Ficha salva com sucesso!', `A Ficha foi criada`, { redirecionaLinkInterno: { pagina: PAGINAS.fichas, query: { [QUERY_PARAMS.FICHA]: idFichaTemporariaSala } } });
            } catch (e) { await toast.erro('Erro ao salvar a evolução do personagem.', e instanceof Error ? e.message : 'Erro ao salvar a evolução do personagem.'); }
        };
    }

    function criarMetodoDeselecionarPersonagem(): () => void { return () => { recipienteEdicaoFichaProps.metodoSairEvolucaoFicha(); }; };

    async function recuperaGanhosAposSelecaoClasse(idClasse: number): Promise<ObjetoGanhosEvolucao> { return await obtemGanhosAposSelecaoClasse(idClasse); };

    async function carregaGanhos() {
        const ganhos = recipienteEdicaoFichaProps.metodo === 'CRIANDO_FICHA_TEMPORARIA'
            ? await obtemGanhosParaCriarFicha_FichaTemporaria(recipienteEdicaoFichaProps.nomeFicha)
            : await obtemGanhosParaEvoluirPorIdFicha(1);

        setGanhos(new GanhosEvolucao(
            ganhos.fichaEmProcessoDeEvolucao,
            criarMetodoSalvarEvolucao(salvarEvolucao),
            criarMetodoDeselecionarPersonagem(),
            recuperaGanhosAposSelecaoClasse,
            { atributos: ganhos.listaReferenciaTodosAtributos, pericias: ganhos.listaReferenciaPericiasDisponiveis, patentes: ganhos.listaReferenciaTodasPatentes, estatisticasDanificaveis: ganhos.listaReferenciaTodasEstatisticasDanificaveis, classes: ganhos.listaReferenciaTodasClasses, tiposGanho: ganhos.listaReferenciaTodosTiposGanho },
            ganhos.listaGanhos,
            ganhos.listaGanhosEstatisticasPorAtributos
        ));
    };

    async function salvarEvolucao(dadosEvolucaoFicha: DadosEvolucaoFicha): Promise<number> {
        setCarregando('Salvando Edições do Personagem');

        try {
            // return salvarEvolucaoDoPersonagem(fichaEvoluida, fichaDeJogoEvoluida);
            // return me_criaEVinculaFicha__FichaTemporaria(fichaDeJogoEvoluida);
            return recipienteEdicaoFichaProps.metodoSalvarFicha(dadosEvolucaoFicha);
        } catch (e) {
            throw e;
        }
    };

    useEffect(() => {
        carregaGanhos();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (ganhos === null) return;

    return (
        <ContextoEdicaoFicha.Provider value={{ ganhos }}>
            <SPA_EdicaoFicha />
        </ContextoEdicaoFicha.Provider>
    );
};
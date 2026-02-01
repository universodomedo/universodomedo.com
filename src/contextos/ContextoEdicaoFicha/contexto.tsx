'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { FichaDeJogo, FichaPersonagemDto, ObjetoGanhosEvolucao, PersonagemDto } from 'types-nora-api';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto'
import { useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';

import ResumoInicial from 'Componentes/PaginasFicha/paginas-etapas/resumo-inicial.tsx';
import ResumoFinal from 'Componentes/PaginasFicha/paginas-etapas/resumo-final.tsx';
import SelecaoClasse from 'Componentes/PaginasFicha/paginas-etapas/selecao-classe.tsx';
import InformativoAumentoMaximoAtributo from 'Componentes/PaginasFicha/paginas-etapas/informativo-aumento-maximo-atributo.tsx';
import EdicaoEstatisticas from 'Componentes/PaginasFicha/paginas-etapas/edicao-estatisticas.tsx';
import InformativoPontosHabilidadeEspecial from 'Componentes/PaginasFicha/paginas-etapas/informativo-pontos-habilidade-especial.tsx';
import EdicaoAtributos from 'Componentes/PaginasFicha/paginas-etapas/edicao-atributos.tsx';
import EdicaoPericias from 'Componentes/PaginasFicha/paginas-etapas/edicao-pericias.tsx';
import EdicaoHabilidadesParanormais from 'Componentes/PaginasFicha/paginas-etapas/informativo-aumento-habilidades-paranormais';
import EdicaoHabilidadesElementais from 'Componentes/PaginasFicha/paginas-etapas/informativo-aumento-habilidades-elementais';

import { obtemGanhosAposSelecaoClasse, obtemGanhosParaEvoluir, salvarEvolucaoDoPersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { PAGINA_PERSONAGEM } from 'Componentes/PaginaPersonagem/types';

import { GanhosEvolucao, EtapaGanhoEvolucao_Classes, EtapaGanhoEvolucao_ValorMaxAtributo, EtapaGanhoEvolucao_Estatisticas, EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, EtapaGanhoEvolucao_HabilidadesEspeciais, EtapaGanhoEvolucao_HabilidadesParanormais, EtapaGanhoEvolucao_HabilidadesElementais } from './classes';

interface ContextoEdicaoFichaProps {
    registraEventoAtualizacaoPagina: (callback: React.Dispatch<React.SetStateAction<any>>) => void;
    executaEAtualiza: (execucao: () => void) => void;
    personagemEmEdicao: PersonagemDto;
    paginaAberta: () => ReactNode;
    ganhos: GanhosEvolucao;
};

const ContextoEdicaoFicha = createContext<ContextoEdicaoFichaProps | undefined>(undefined);

export const useContextoEdicaoFicha = (): ContextoEdicaoFichaProps => {
    const context = useContext(ContextoEdicaoFicha);
    if (!context) throw new Error('useContextoEdicaoFicha precisa estar dentro de um ContextoEdicaoFicha');
    return context;
};

export const ContextoEdicaoFichaProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const { personagemSelecionado } = useContextoPaginaPersonagens();
    const { navegarPara } = useContextoPaginaPersonagem();
    const [personagemEmEdicao, setPersonagemEmEdicao] = useState<PersonagemDto | null>(null);
    const [ganhos, setGanhos] = useState<GanhosEvolucao | null>(null);

    const setStateRef = useRef<React.Dispatch<React.SetStateAction<Record<string, any>>> | null>(null);
    const registraEventoAtualizacaoPagina = (callback: React.Dispatch<React.SetStateAction<any>>) => { setStateRef.current = callback; };
    const acionaEventoAtualizacaoPagina = () => { if (setStateRef.current) setStateRef.current((prev: Record<string, any>) => ({ ...prev, updated: true })); };

    const paginaAberta = () => {
        if (ganhos?.estaAbertoResumoInicial) return <ResumoInicial />;
        if (ganhos?.estaAbertoResumoFinal) return <ResumoFinal />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Classes) return <SelecaoClasse />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_ValorMaxAtributo) return <InformativoAumentoMaximoAtributo />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Estatisticas) return <EdicaoEstatisticas />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Atributos) return <EdicaoAtributos />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Pericias) return <EdicaoPericias />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesEspeciais) return <InformativoPontosHabilidadeEspecial />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesParanormais) return <EdicaoHabilidadesParanormais />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesElementais) return <EdicaoHabilidadesElementais />;
    };

    async function executaEAtualiza(execucao: () => void | Promise<void>) {
        await Promise.resolve(execucao());
        acionaEventoAtualizacaoPagina();
    }

    function criarMetodoSalvarEvolucao(salvarEvolucao: (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => Promise<boolean>): (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => Promise<boolean> {
        return async (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => {
            const sucesso = await salvarEvolucao(fichaEvoluida, fichaDeJogoEvoluida);

            if (!sucesso) {
                alert("Erro ao salvar a evolução do personagem.");
            } else {
                window.location.reload();
            }

            return sucesso;
        };
    }

    function criarMetodoDeselecionarPersonagem(): () => void {
        return () => {
            navegarPara(PAGINA_PERSONAGEM.INICIAL);
        };
    }

    async function recuperaGanhosAposSelecaoClasse(idClasse: number): Promise<ObjetoGanhosEvolucao> {
        return await obtemGanhosAposSelecaoClasse(idClasse);
    }

    async function carregaGanhos() {
        if (personagemEmEdicao) {
            const ganhos = await obtemGanhosParaEvoluir(personagemEmEdicao.id);

            setGanhos(new GanhosEvolucao(
                ganhos.personagem,
                ganhos.fichaDeJogoVigente,
                ganhos.nivelDoProcedimento,
                criarMetodoSalvarEvolucao(salvarEvolucao),
                criarMetodoDeselecionarPersonagem(),
                recuperaGanhosAposSelecaoClasse,
                { atributos: ganhos.listaReferenciaTodosAtributos, pericias: ganhos.listaReferenciaPericiasDisponiveis, patentes: ganhos.listaReferenciaTodasPatentes, estatisticasDanificaveis: ganhos.listaReferenciaTodasEstatisticasDanificaveis, classes: ganhos.listaReferenciaTodasClasses, tiposGanho: ganhos.listaReferenciaTodosTiposGanho },
                ganhos.listaGanhos,
                ganhos.listaGanhosEstatisticasPorAtributos
            ));
        }
    }

    async function salvarEvolucao(fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo): Promise<boolean> {
        setCarregando('Salvando Edições do Personagem');

        try {
            return salvarEvolucaoDoPersonagem(fichaEvoluida, fichaDeJogoEvoluida);
        } catch {
            return false;
        }
    }

    useEffect(() => {
        setPersonagemEmEdicao(personagemSelecionado);
    }, []);

    useEffect(() => {
        carregaGanhos();
    }, [personagemEmEdicao]);

    if (carregando) return <h2>{carregando}</h2>

    if (!personagemEmEdicao) return;

    if (!paginaAberta) return;

    if (ganhos === null) return;

    return (
        <ContextoEdicaoFicha.Provider value={{ registraEventoAtualizacaoPagina, executaEAtualiza, personagemEmEdicao, paginaAberta, ganhos }}>
            {children}
        </ContextoEdicaoFicha.Provider>
    );
};
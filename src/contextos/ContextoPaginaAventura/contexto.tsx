'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraDto, SessaoDto } from 'types-nora-api';
import { obtemDadosSessaoParaAssistir, obtemGrupoAventuraParaAssistir } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAventuraProps {
    grupoAventuraSelecionado: AventuraDto;
    buscaGrupoAventuraSelecionado: (idGrupoAventura: number) => void;
    sessaoSelecionada: SessaoDto | null;
    buscaSessao: (idSessao: number) => void;
    limpaSessao: () => void;
    podeAlterarSessaoManualmente: { podeBuscarAnterior: boolean, podeBuscarSeguinte: boolean };
    alteraSessaoManualmente: (direcao: 'anterior' | 'seguinte') => void;
};

const ContextoPaginaAventura = createContext<ContextoPaginaAventuraProps | undefined>(undefined);

export const useContextoPaginaAventura = (): ContextoPaginaAventuraProps => {
    const context = useContext(ContextoPaginaAventura);
    if (!context) throw new Error('useContextoPaginaAventura precisa estar dentro de um ContextoPaginaAventura');
    return context;
};

export const ContextoPaginaAventuraProvider = ({ children, idGrupoAventura, episodioIndexInicial = null }: { children: React.ReactNode; idGrupoAventura: number; episodioIndexInicial?: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [grupoAventuraSelecionado, setGrupoAventuraSelecionado] = useState<AventuraDto | null>(null);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    //
    const sessoes = !grupoAventuraSelecionado ? [] : grupoAventuraSelecionado.gruposAventura?.[0]?.sessoes || [];
    const indexAtual = sessaoSelecionada ? sessoes.findIndex(s => s.id === sessaoSelecionada.id) : -1;

    const navegacaoSessoes = {
        idSessaoAnterior: !sessaoSelecionada
            ? undefined
            : indexAtual === 0
                ? null
                : sessoes[indexAtual - 1]?.id,

        idSessaoSeguinte: !sessaoSelecionada
            ? sessoes[0]?.id
            : indexAtual === sessoes.length - 1
                ? undefined
                : sessoes[indexAtual + 1]?.id
    };

    const podeAlterarSessaoManualmente: { podeBuscarAnterior: boolean, podeBuscarSeguinte: boolean } = {
        podeBuscarAnterior: navegacaoSessoes.idSessaoAnterior !== undefined,
        podeBuscarSeguinte: navegacaoSessoes.idSessaoSeguinte !== undefined,
    };
    //

    async function buscaGrupoAventuraSelecionado(idGrupoAventura: number) {
        setCarregando('Buscando Episódios');

        try {
            setGrupoAventuraSelecionado(await obtemGrupoAventuraParaAssistir(idGrupoAventura));
        } catch {
            setGrupoAventuraSelecionado(null);
        } finally {
            setCarregando(null);
        }
    };

    async function buscaSessao(idSessao: number) {
        setCarregando('Buscando Sessão');

        try {
            setSessaoSelecionada(await obtemDadosSessaoParaAssistir(idSessao));
        } catch {
            setSessaoSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    async function limpaSessao() { setSessaoSelecionada(null); };

    async function alteraSessaoManualmente(direcao: 'anterior' | 'seguinte') {
        if ((direcao === 'anterior' && navegacaoSessoes.idSessaoAnterior === undefined) || (direcao === 'seguinte') && navegacaoSessoes.idSessaoSeguinte === undefined) return;

        if (direcao === 'anterior' && !navegacaoSessoes.idSessaoAnterior) { limpaSessao(); return; }

        const idSessaoBuscandoManualmente = direcao === 'anterior' ? navegacaoSessoes.idSessaoAnterior! : navegacaoSessoes.idSessaoSeguinte!;
        buscaSessao(idSessaoBuscandoManualmente);
    };

    useEffect(() => {
        buscaGrupoAventuraSelecionado(idGrupoAventura);
    }, []);

    useEffect(() => {
        if (episodioIndexInicial === 0) {
            limpaSessao();
            return;
        }

        if (episodioIndexInicial !== null && grupoAventuraSelecionado) {
            const sessoesOrdenadas = grupoAventuraSelecionado.gruposAventura?.[0].sessoes.sort((a, b) => a.id - b.id);

            if (sessoesOrdenadas && episodioIndexInicial > 0 && episodioIndexInicial <= sessoesOrdenadas.length) {
                const sessao = sessoesOrdenadas[episodioIndexInicial - 1]; // -1 porque arrays começam em 0
                buscaSessao(sessao.id);
            }
        }
    }, [episodioIndexInicial, grupoAventuraSelecionado]);

    if (carregando) return <div>{carregando}</div>;

    if (!carregando && !grupoAventuraSelecionado) return <div>Erro ao buscar Aventura</div>

    if (!grupoAventuraSelecionado) return;

    return (
        <ContextoPaginaAventura.Provider value={{ grupoAventuraSelecionado, buscaGrupoAventuraSelecionado, sessaoSelecionada, buscaSessao, limpaSessao, podeAlterarSessaoManualmente, alteraSessaoManualmente }}>
            {children}
        </ContextoPaginaAventura.Provider>
    );
};
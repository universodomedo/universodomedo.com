'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraDto, DetalheSessaoCanonicaDto } from 'types-nora-api';
import { obtemDadosSessaoParaAssistir, buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAventuraProps {
    grupoAventuraSelecionado: AventuraDto;
    buscaGrupoAventuraSelecionado: (idGrupoAventura: number) => void;
    detalheSessaoSelecionada: DetalheSessaoCanonicaDto | null;
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
    const [detalheSessaoSelecionada, setDetalheSessaoSelecionada] = useState<DetalheSessaoCanonicaDto | null>(null);

    //
    const detalhesSessao = !grupoAventuraSelecionado ? [] : grupoAventuraSelecionado.gruposAventura?.[0]?.detalhesSessaoesCanonicas || [];
    const indexAtual = detalheSessaoSelecionada ? detalhesSessao.findIndex(detalheSessao => detalheSessao.sessao.id === detalheSessaoSelecionada.sessao.id) : -1;

    const navegacaoSessoes = {
        idSessaoAnterior: !detalheSessaoSelecionada
            ? undefined
            : indexAtual === 0
                ? null
                : detalhesSessao[indexAtual - 1]?.sessao.id,

        idSessaoSeguinte: !detalheSessaoSelecionada
            ? detalhesSessao[0]?.sessao.id
            : indexAtual === detalhesSessao.length - 1
                ? undefined
                : detalhesSessao[indexAtual + 1]?.sessao.id
    };

    const podeAlterarSessaoManualmente: { podeBuscarAnterior: boolean, podeBuscarSeguinte: boolean } = {
        podeBuscarAnterior: navegacaoSessoes.idSessaoAnterior !== undefined,
        podeBuscarSeguinte: navegacaoSessoes.idSessaoSeguinte !== undefined,
    };
    //

    async function buscaGrupoAventuraSelecionado(idGrupoAventura: number) {
        setCarregando('Buscando Episódios');

        try {
            setGrupoAventuraSelecionado(await buscaGrupoAventuraEspecifico(idGrupoAventura));
        } catch {
            setGrupoAventuraSelecionado(null);
        } finally {
            setCarregando(null);
        }
    };

    async function buscaSessao(idSessao: number) {
        setCarregando('Buscando Sessão');

        try {
            setDetalheSessaoSelecionada(await obtemDadosSessaoParaAssistir(idSessao));
        } catch {
            setDetalheSessaoSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    async function limpaSessao() { setDetalheSessaoSelecionada(null); };

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
            const sessoesOrdenadas = grupoAventuraSelecionado.gruposAventura?.[0].detalhesSessaoesCanonicas.sort((a, b) => a.episodio - b.episodio);

            if (sessoesOrdenadas && episodioIndexInicial > 0 && episodioIndexInicial <= sessoesOrdenadas.length) {
                const sessao = sessoesOrdenadas[episodioIndexInicial - 1]; // -1 porque arrays começam em 0
                buscaSessao(sessao.sessao.id);
            }
        }
    }, [episodioIndexInicial, grupoAventuraSelecionado]);

    if (carregando) return <div>{carregando}</div>;

    if (!carregando && !grupoAventuraSelecionado) return <div>Erro ao buscar Aventura</div>

    if (!grupoAventuraSelecionado) return;

    return (
        <ContextoPaginaAventura.Provider value={{ grupoAventuraSelecionado, buscaGrupoAventuraSelecionado, detalheSessaoSelecionada, buscaSessao, limpaSessao, podeAlterarSessaoManualmente, alteraSessaoManualmente }}>
            {children}
        </ContextoPaginaAventura.Provider>
    );
};
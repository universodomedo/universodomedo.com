'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheSessaoCanonicaDto, GrupoAventuraDto, SessaoDto } from 'types-nora-api';
import { obtemSessaoGeral, buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAventuraProps {
    grupoAventuraSelecionado: GrupoAventuraDto;
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
    const [grupoAventuraSelecionado, setGrupoAventuraSelecionado] = useState<GrupoAventuraDto | null>(null);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    //
    const detalhesSessao = !grupoAventuraSelecionado ? [] : grupoAventuraSelecionado.detalhesSessoesAventuras || [];
    const indexAtual = sessaoSelecionada ? detalhesSessao.findIndex(detalheSessao => detalheSessao.sessao.id === sessaoSelecionada.id) : -1;

    const navegacaoSessoes = {
        idSessaoAnterior: !sessaoSelecionada
            ? undefined
            : indexAtual === 0
                ? null
                : detalhesSessao[indexAtual - 1]?.sessao.id,

        idSessaoSeguinte: !sessaoSelecionada
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
            setSessaoSelecionada(await obtemSessaoGeral(idSessao));
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
            const sessoesOrdenadas = grupoAventuraSelecionado.detalhesSessoesAventuras.sort((a, b) => a.episodio - b.episodio);

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
        <ContextoPaginaAventura.Provider value={{ grupoAventuraSelecionado, buscaGrupoAventuraSelecionado, sessaoSelecionada, buscaSessao, limpaSessao, podeAlterarSessaoManualmente, alteraSessaoManualmente }}>
            {children}
        </ContextoPaginaAventura.Provider>
    );
};
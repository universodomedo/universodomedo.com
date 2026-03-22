'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { me_obtemFichas, me_obtemSessoesPrevistasQueEuVouJogar } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

interface ContextoPaginaPreJogo_JogadorProps {
    sessoesPrevistas: VIEW_SessaoDeJogadorDto[];
    setIdSessaoSelecionada: (v: number) => void;
    deselecionaSessao: () => void;
    sessaoSelecionada: VIEW_SessaoDeJogadorDto | null;
    fichas: FichaTemporariaVisualizacaoDetalhadaDto[];
};

const ContextoPaginaPreJogo_Jogador = createContext<ContextoPaginaPreJogo_JogadorProps | undefined>(undefined);

export const useContextoPaginaPreJogo_Jogador = (): ContextoPaginaPreJogo_JogadorProps => {
    const context = useContext(ContextoPaginaPreJogo_Jogador);
    if (!context) throw new Error('useContextoPaginaPreJogo_Jogador precisa estar dentro de um ContextoPaginaPreJogo_Jogador');
    return context;
};

export const ContextoPaginaPreJogo_JogadorProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregandoFichas, setCarregandoFichas] = useState(false);
    const [carregandoSessoes, setCarregandoSessoes] = useState(false);

    const [sessoesPrevistas, setSessoesPrevistas] = useState<VIEW_SessaoDeJogadorDto[] | null>(null);
    const [idSessaoSelecionada, setIdSessaoSelecionada] = useState<number | null>(null);
    const sessaoSelecionada: VIEW_SessaoDeJogadorDto | null = sessoesPrevistas && idSessaoSelecionada ? sessoesPrevistas.find(sessao => sessao.id === idSessaoSelecionada) ?? null : null;

    const [fichas, setFichas] = useState<FichaTemporariaVisualizacaoDetalhadaDto[] | null>(null);

    async function buscaSessoesPrevistas() {
        setCarregandoSessoes(true);

        try {
            setSessoesPrevistas(await me_obtemSessoesPrevistasQueEuVouJogar());
        } catch {
            setSessoesPrevistas([]);
            toast.erro('Houve um erro enquanto carregando suas Sessões');
        } finally {
            setCarregandoSessoes(false);
        }
    };

    async function buscaFichasUsuario() {
        setCarregandoFichas(true);

        try {
            setFichas(await me_obtemFichas());
        } catch {
            setFichas([]);
        } finally {
            setCarregandoFichas(false);
        }
    }

    function deselecionaSessao() { setIdSessaoSelecionada(null); };

    useEffect(() => {
        buscaSessoesPrevistas();
        buscaFichasUsuario();
    }, []);

    if (carregandoFichas || carregandoSessoes) {
        let mensagemCarregando = '';
        if (carregandoFichas) mensagemCarregando += 'Carregando suas fichas...\n';
        if (carregandoSessoes) mensagemCarregando += 'Carregando suas sessões...\n';
        return <div style={{ whiteSpace: 'pre-line' }}>{mensagemCarregando}</div>;
    }

    if (sessoesPrevistas === null || fichas === null) return;

    return (
        <ContextoPaginaPreJogo_Jogador.Provider value={{ sessoesPrevistas, setIdSessaoSelecionada, deselecionaSessao, sessaoSelecionada, fichas }}>
            {children}
        </ContextoPaginaPreJogo_Jogador.Provider>
    );
};
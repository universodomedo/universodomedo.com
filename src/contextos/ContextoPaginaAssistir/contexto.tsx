'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraCompletaDto, AventuraParaAssistirDto, DetalheSessaoCanonicaParaAssistirDto, GrupoAventuraParaAssistirDto } from 'types-nora-api';

import { obtemAventuraCompleta, obtemAventurasParaAssistir, obtemUltimaSessoesPostadas } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

export type RegistroSessaoSelecionadaParaAssistir = { idSessao: number; } | { idGrupoAventura: number; episodio: number | null; };

interface ContextoPaginaAssistirProps {
    aventurasListadas: AventuraParaAssistirDto[];
    aventuraSelecionada: AventuraCompletaDto | null;
    buscaAventuraSelecionada: (idAventura: number) => void;
    detalhesUltimasSessoesPostadas: DetalheSessaoCanonicaParaAssistirDto[] | null;
    registroSessaoSelecionada: RegistroSessaoSelecionadaParaAssistir | null;
    setRegistroSessaoSelecionada: (v: RegistroSessaoSelecionadaParaAssistir) => void;
    deselecionarRegistroSessaoSelecionada: () => void;
};

const ContextoPaginaAssistir = createContext<ContextoPaginaAssistirProps | undefined>(undefined);

export const useContextoPaginaAssistir = (): ContextoPaginaAssistirProps => {
    const context = useContext(ContextoPaginaAssistir);
    if (!context) throw new Error('useContextoPaginaAssistir precisa estar dentro de um ContextoPaginaAssistir');
    return context;
};

export const ContextoPaginaAssistirProvider = ({ children, idAventuraInicial = null }: { children: React.ReactNode; idAventuraInicial?: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);

    const [aventurasListadas, setAventurasListadas] = useState<AventuraParaAssistirDto[] | null>(null);
    const [aventuraSelecionada, setAventuraSelecionada] = useState<AventuraCompletaDto | null>(null);
    const [detalhesUltimasSessoesPostadas, setDetalhesUltimasSessoesPostadas] = useState<DetalheSessaoCanonicaParaAssistirDto[] | null>(null);

    const [registroSessaoSelecionada, setRegistroSessaoSelecionada] = useState<RegistroSessaoSelecionadaParaAssistir | null>(null);
    const [grupoAventuraAssistindo, setGrupoAventuraAssistindo] = useState<GrupoAventuraParaAssistirDto | null>(null);

    async function buscaAventurasListadas() {
        setCarregando('Buscando Aventuras');

        try {
            setAventurasListadas(await obtemAventurasParaAssistir());
        } catch {
            setAventurasListadas(null);
            toast.erro('Houver um erro ao carregar as aventuras');
        } finally {
            setCarregando(null);
        }
    };

    async function buscaUltimaSessoesPostadas() {
        setCarregando('Buscando Últimas Sessões Postadas');

        try {
            setDetalhesUltimasSessoesPostadas(await obtemUltimaSessoesPostadas());
        } catch {
            setDetalhesUltimasSessoesPostadas(null);
        } finally {
            setCarregando(null);
        }
    };

    async function buscaAventuraSelecionada(idAventura: number) {
        setCarregando('Buscando Aventura Selecionada');

        try {
            setAventuraSelecionada(await obtemAventuraCompleta(idAventura));
        } catch {
            setAventuraSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    function deselecionarRegistroSessaoSelecionada() { setRegistroSessaoSelecionada(null) };

    useEffect(() => {
        buscaAventurasListadas();
        buscaUltimaSessoesPostadas();

        if (idAventuraInicial) buscaAventuraSelecionada(idAventuraInicial);
    }, []);

    if (carregando || aventurasListadas === null) return <div>{carregando}</div>;

    return (
        <ContextoPaginaAssistir.Provider value={{ aventurasListadas, aventuraSelecionada, buscaAventuraSelecionada, detalhesUltimasSessoesPostadas, registroSessaoSelecionada, setRegistroSessaoSelecionada, deselecionarRegistroSessaoSelecionada }}>
            {children}
        </ContextoPaginaAssistir.Provider>
    );
};
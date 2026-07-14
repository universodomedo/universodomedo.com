'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_palcosAtualizados, type PalcoResumoDto, type RESPONSE__Palco_listarComandaveis, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs, useSocketEpoch } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

function listarComandaveisWs(): Promise<RESPONSE__Palco_listarComandaveis> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.listarComandaveis, {}, { onSuccess: (response: RESPONSE__Palco_listarComandaveis) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

interface ContextoControlePalcoProps {
    painelAberto: boolean;
    abrirPainel: () => void;
    fecharPainel: () => void;
    togglePainel: () => void;
    // Palcos que o usuário comanda (alimenta a visibilidade da ação na barra e o seletor do painel).
    palcosComandaveis: PalcoResumoDto[];
    codigoSelecionado: string | null;
    selecionarPalco: (codigoPalco: string) => void;
};

const ContextoControlePalco = createContext<ContextoControlePalcoProps | undefined>(undefined);

export const useContextoControlePalco = (): ContextoControlePalcoProps => {
    const context = useContext(ContextoControlePalco);
    if (!context) throw new Error('useContextoControlePalco precisa estar dentro de um ContextoControlePalco__Provider');
    return context;
};

// Comando do palco FORA da página: o responsável navega pela plataforma (testa Partidas, apresenta funcionalidades)
// com o controle sempre à mão pela Barra de Ações. A página /palco segue como visão geral.
export const ContextoControlePalco__Provider = ({ children }: { children: React.ReactNode }) => {
    const { estaAutenticado } = useContextoAutenticacao();
    const epoch = useSocketEpoch();

    const [painelAberto, setPainelAberto] = useState<boolean>(false);
    const [palcosComandaveis, setPalcosComandaveis] = useState<PalcoResumoDto[]>([]);
    const [codigoSelecionado, setCodigoSelecionado] = useState<string | null>(null);

    const abrirPainel = useCallback(() => { setPainelAberto(true); }, []);
    const fecharPainel = useCallback(() => { setPainelAberto(false); }, []);
    const togglePainel = useCallback(() => { setPainelAberto(v => !v); }, []);
    const selecionarPalco = useCallback((codigoPalco: string) => { setCodigoSelecionado(codigoPalco); }, []);

    const recarregarComandaveis = useCallback(() => {
        listarComandaveisWs().then(r => { setPalcosComandaveis(r.palcos); }).catch(() => { setPalcosComandaveis([]); });
    }, []);

    // Login/reconexão (epoch) => refetch; deslogado => zera (a ação some da barra).
    useEffect(() => {
        if (!estaAutenticado) { setPalcosComandaveis([]); return; }
        recarregarComandaveis();
    }, [estaAutenticado, epoch, recarregarComandaveis]);

    // Aberturas/finalizações chegam por push; a lista comandável é por usuário, então re-consulta.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.palcosAtualizados, {
        onSuccess: (_data: EMIT__Palco_palcosAtualizados) => { if (estaAutenticado) recarregarComandaveis(); },
    });

    // Seleção sempre válida: o selecionado sumiu (finalizado) => cai para o primeiro; lista vazia => fecha o painel.
    useEffect(() => {
        if (palcosComandaveis.length === 0) { setCodigoSelecionado(null); setPainelAberto(false); return; }
        if (!palcosComandaveis.some(p => p.codigoPalco === codigoSelecionado)) setCodigoSelecionado(palcosComandaveis[0].codigoPalco);
    }, [palcosComandaveis, codigoSelecionado]);

    return (
        <ContextoControlePalco.Provider value={{ painelAberto, abrirPainel, fecharPainel, togglePainel, palcosComandaveis, codigoSelecionado, selecionarPalco }}>
            {children}
        </ContextoControlePalco.Provider>
    );
};

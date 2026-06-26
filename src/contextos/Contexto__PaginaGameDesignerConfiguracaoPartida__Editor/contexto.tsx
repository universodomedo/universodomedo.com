'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EventosApiRest, type ConfiguracaoPartida, type PartidaResumo } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/SPA__PaginaGameDesignerConfiguracaoPartida__Editor';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props {
    partida: PartidaResumo;
    configuracaoInicial: ConfiguracaoPartida | null;
    carregandoConfig: boolean;
    salvando: boolean;
    salvar: (configuracao: ConfiguracaoPartida) => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    partida: PartidaResumo;
    salvando: boolean;
    fecharConfiguracao: () => void;
    salvarConfiguracao: (configuracao: ConfiguracaoPartida) => Promise<void>;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Editor = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Editor precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Editor');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider = ({ partida, salvando, fecharConfiguracao, salvarConfiguracao }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: `Configurar · ${partida.nome}`, fecharProps: { tipo: 'acao', executar: fecharConfiguracao, tituloTooltip: 'Voltar para a Partida' } });

    const [configuracaoInicial, setConfiguracaoInicial] = useState<ConfiguracaoPartida | null>(null);
    const [carregandoConfig, setCarregandoConfig] = useState(true);

    useEffect(() => {
        let ativo = true;

        async function carregar(): Promise<void> {
            setCarregandoConfig(true);

            try {
                const resposta = await NoraApi.RestGET(EventosApiRest.GET.Partidas.configuracao, { id: partida.id }, { mensagemErro: 'Não foi possível carregar a configuração da Partida.' });
                if (ativo) setConfiguracaoInicial(resposta.configuracao);
            } catch {
                if (ativo) setConfiguracaoInicial(null);
            } finally {
                if (ativo) setCarregandoConfig(false);
            }
        };

        void carregar();
        return () => { ativo = false; };
    }, [partida.id]);

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider value={{ partida, configuracaoInicial, carregandoConfig, salvando, salvar: salvarConfiguracao, cancelar: fecharConfiguracao }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Editor />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider>
    );
};

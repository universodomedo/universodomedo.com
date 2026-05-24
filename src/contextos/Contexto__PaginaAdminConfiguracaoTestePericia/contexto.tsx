'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONFIGURACAO_DEFAULT_TESTE_PERICIA, adicionaProximoIntervaloConfiguracaoTestePericia, projetaConfiguracaoTestePericia, removeUltimoIntervaloOpcionalConfiguracaoTestePericia, type ConfiguracaoTestePericia, type ConfiguracaoTestePericiaProjetada, type LinhaPreviewConfiguracaoTestePericia } from 'types-nora-api';

import { useToast } from 'Hooks/useToast';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';
import { salvaConfiguracaoTestePericia } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export interface Contexto__PaginaAdminConfiguracaoTestePericia__Props {
    configuracaoProjetada: ConfiguracaoTestePericiaProjetada;
    linhasConfiguradas: LinhaPreviewConfiguracaoTestePericia[];
    linhasPreview: LinhaPreviewConfiguracaoTestePericia[];
    salvando: boolean;
    erro: string | null;
    podeRemoverUltimoIntervalo: boolean;
    alterarValorConfigurado: (valorAtributo: number, valorConfigurado: number) => void;
    adicionarProximoIntervalo: () => void;
    removerUltimoIntervaloOpcional: () => void;
    salvarConfiguracao: () => Promise<void>;
};

const Contexto__PaginaAdminConfiguracaoTestePericia = createContext<Contexto__PaginaAdminConfiguracaoTestePericia__Props | undefined>(undefined);

export const useContexto__PaginaAdminConfiguracaoTestePericia = (): Contexto__PaginaAdminConfiguracaoTestePericia__Props => {
    const context = useContext(Contexto__PaginaAdminConfiguracaoTestePericia);
    if (!context) throw new Error('useContexto__PaginaAdminConfiguracaoTestePericia precisa estar dentro de um Contexto__PaginaAdminConfiguracaoTestePericia');
    return context;
};

export const Contexto__PaginaAdminConfiguracaoTestePericia__Provider = ({ children }: { children: ReactNode; }) => {
    const toast = useToast();
    const cache = useAppSelector(selectCache);
    const configuracaoCache = useMemo(() => cache?.configuracaoTestePericia ?? projetaConfiguracaoTestePericia(CONFIGURACAO_DEFAULT_TESTE_PERICIA), [cache?.configuracaoTestePericia]);

    const [configuracaoProjetada, setConfiguracaoProjetada] = useState<ConfiguracaoTestePericiaProjetada>(configuracaoCache);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        setConfiguracaoProjetada(configuracaoCache);
    }, [configuracaoCache]);

    const aplicaConfiguracao = useCallback((configuracao: ConfiguracaoTestePericia) => {
        try {
            setConfiguracaoProjetada(projetaConfiguracaoTestePericia(configuracao));
            setErro(null);
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Configuracao invalida';
            setErro(mensagem);
            void toast.erro('Configuracao invalida', mensagem);
        }
    }, [toast]);

    const alterarValorConfigurado = useCallback((valorAtributo: number, valorConfigurado: number) => {
        aplicaConfiguracao({
            intervalos: configuracaoProjetada.configuracao.intervalos.map(intervalo => intervalo.valorAtributo === valorAtributo ? { ...intervalo, valorConfigurado } : intervalo),
        });
    }, [aplicaConfiguracao, configuracaoProjetada.configuracao.intervalos]);

    const adicionarProximoIntervalo = useCallback(() => {
        aplicaConfiguracao(adicionaProximoIntervaloConfiguracaoTestePericia(configuracaoProjetada.configuracao));
    }, [aplicaConfiguracao, configuracaoProjetada.configuracao]);

    const removerUltimoIntervaloOpcional = useCallback(() => {
        aplicaConfiguracao(removeUltimoIntervaloOpcionalConfiguracaoTestePericia(configuracaoProjetada.configuracao));
    }, [aplicaConfiguracao, configuracaoProjetada.configuracao]);

    const salvarConfiguracao = useCallback(async () => {
        setSalvando(true);
        setErro(null);

        try {
            const configuracaoSalva = await salvaConfiguracaoTestePericia({ configuracao: configuracaoProjetada.configuracao });
            setConfiguracaoProjetada(configuracaoSalva);
            void toast.sucesso('Configuracao salva', 'Os proximos testes de pericia ja usam a nova configuracao.');
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Falha ao salvar configuracao';
            setErro(mensagem);
            void toast.erro('Falha ao salvar configuracao', mensagem);
        } finally {
            setSalvando(false);
        }
    }, [configuracaoProjetada.configuracao, toast]);

    const linhasConfiguradas = useMemo(() => configuracaoProjetada.linhas.filter(linha => linha.configurado), [configuracaoProjetada.linhas]);
    const linhasPreview = useMemo(() => configuracaoProjetada.linhas.filter(linha => !linha.configurado), [configuracaoProjetada.linhas]);
    const podeRemoverUltimoIntervalo = configuracaoProjetada.valorAtributoMaximoConfigurado > 2;

    return (
        <Contexto__PaginaAdminConfiguracaoTestePericia.Provider value={{ configuracaoProjetada, linhasConfiguradas, linhasPreview, salvando, erro, podeRemoverUltimoIntervalo, alterarValorConfigurado, adicionarProximoIntervalo, removerUltimoIntervaloOpcional, salvarConfiguracao }}>
            {children}
        </Contexto__PaginaAdminConfiguracaoTestePericia.Provider>
    );
};

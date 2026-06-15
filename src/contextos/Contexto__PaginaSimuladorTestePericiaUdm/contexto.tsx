'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EventosApiRest, type AnaliseTestesPericiaInput, type PatentePericiaCompletaDto, type ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import type { CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';
import { useConfiguracaoSimuladorTestePericiaUdm } from './useConfiguracaoSimuladorTestePericiaUdm';

function useEstadoPaginaSimuladorTestePericiaUdm() {
    const cache = useAppSelector(selectCache);
    const patentes = useMemo(() => [...(cache?.patentesPericia ?? [])].sort((primeira, segunda) => primeira.id - segunda.id), [cache?.patentesPericia]);
    const configuracao = useConfiguracaoSimuladorTestePericiaUdm(patentes);
    const analise = useAnaliseTestesPericia(configuracao.cenarios, configuracao.resultadosAlvo, patentes.length > 0);

    return { ...configuracao, ...analise, patentes };
};

export type Contexto__PaginaSimuladorTestePericiaUdm__Props = ReturnType<typeof useEstadoPaginaSimuladorTestePericiaUdm>;

const Contexto__PaginaSimuladorTestePericiaUdm = createContext<Contexto__PaginaSimuladorTestePericiaUdm__Props | undefined>(undefined);

export const useContexto__PaginaSimuladorTestePericiaUdm = (): Contexto__PaginaSimuladorTestePericiaUdm__Props => {
    const context = useContext(Contexto__PaginaSimuladorTestePericiaUdm);
    if (!context) throw new Error('useContexto__PaginaSimuladorTestePericiaUdm precisa estar dentro de um Contexto__PaginaSimuladorTestePericiaUdm');
    return context;
};

export const Contexto__PaginaSimuladorTestePericiaUdm__Provider = ({ children }: { children: ReactNode; }) => {
    const estado = useEstadoPaginaSimuladorTestePericiaUdm();
    return <Contexto__PaginaSimuladorTestePericiaUdm.Provider value={estado}>{children}</Contexto__PaginaSimuladorTestePericiaUdm.Provider>;
};

function useAnaliseTestesPericia(cenarios: readonly CenarioSimuladorTestePericiaUdm[], resultadosAlvo: readonly number[], possuiPatentes: boolean) {
    const [resultados, setResultados] = useState<readonly ResultadoAnaliseCenarioTestePericia[]>([]);
    const [analisando, setAnalisando] = useState(false);
    const [erroAnalise, setErroAnalise] = useState<string | null>(null);

    useEffect(() => {
        if (!possuiPatentes || cenarios.length === 0) return;
        let ativo = true;
        setAnalisando(true);
        setResultados([]);
        setErroAnalise(null);

        const temporizador = window.setTimeout(() => {
            const input: AnaliseTestesPericiaInput = { cenarios: cenarios.map(montaInputCenario), resultadosAlvo };
            void NoraApi.RestPOST(EventosApiRest.POST.TestePericia.analisar, input, { exibirToastErro: false }).then(resposta => {
                if (!ativo) return;
                setResultados(resposta.cenarios);
            }).catch(() => {
                if (!ativo) return;
                setResultados([]);
                setErroAnalise('Não foi possível calcular a análise dos cenários com a configuração atual.');
            }).finally(() => {
                if (ativo) setAnalisando(false);
            });
        }, 180);

        return () => {
            ativo = false;
            window.clearTimeout(temporizador);
        };
    }, [cenarios, possuiPatentes, resultadosAlvo]);

    return { resultados, analisando, erroAnalise };
};

function montaInputCenario(cenario: CenarioSimuladorTestePericiaUdm): AnaliseTestesPericiaInput['cenarios'][number] {
    return { id: cenario.id, valorAtributoBase: cenario.valorAtributoBase, incrementoModificadoresAtributo: cenario.incrementoModificadoresAtributo, idPatentePericia: cenario.idPatentePericia, incrementoModificadoresValorMaximo: cenario.incrementoModificadoresValorMaximo };
};
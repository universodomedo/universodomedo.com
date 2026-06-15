'use client';

import { useCallback, useRef, useState } from 'react';

import { LIMITES_SIMULADOR_DISTRIBUICAO_TESTE } from 'Funcionalidades/simuladorDistribuicaoTeste/regrasSimuladorDistribuicaoTeste';
import type { ConfiguracaoCenarioDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/simuladorDistribuicaoTeste.tipos';

const CORES_CENARIOS = ['#f6d16d', '#6dc8f6', '#b98cff', '#75df9b', '#ff8f70', '#f58fd2', '#8ce0d3', '#d5dc75'] as const;

const CENARIOS_INICIAIS: readonly ConfiguracaoCenarioDistribuicaoTeste[] = [
    { id: 'cenario-1', nome: 'Cenário A', quantidadeDados: 1, quantidadeFaces: 20, bonus: 5, cor: CORES_CENARIOS[0] },
    { id: 'cenario-2', nome: 'Cenário B', quantidadeDados: 3, quantidadeFaces: 20, bonus: 5, cor: CORES_CENARIOS[1] },
    { id: 'cenario-3', nome: 'Cenário C', quantidadeDados: 5, quantidadeFaces: 20, bonus: 5, cor: CORES_CENARIOS[2] },
];

type AlteracoesCenario = Partial<Pick<ConfiguracaoCenarioDistribuicaoTeste, 'nome' | 'quantidadeDados' | 'quantidadeFaces' | 'bonus' | 'cor'>>;

export function useConfiguracaoSimuladorDistribuicoesTeste() {
    const [cenarios, setCenarios] = useState<readonly ConfiguracaoCenarioDistribuicaoTeste[]>(CENARIOS_INICIAIS);
    const [limiares, setLimiares] = useState<readonly number[]>([10, 15, 20, 25]);
    const [novoLimiar, setNovoLimiar] = useState(0);
    const proximoId = useRef(4);

    const alterarCenario = useCallback((cenarioId: string, alteracoes: AlteracoesCenario) => {
        setCenarios(atuais => atuais.map(cenario => cenario.id === cenarioId ? { ...cenario, ...alteracoes } : cenario));
    }, []);

    const adicionarCenario = useCallback(() => {
        setCenarios(atuais => {
            if (atuais.length >= LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeCenariosMaxima) return atuais;
            const numero = proximoId.current;
            proximoId.current += 1;
            return [...atuais, { id: `cenario-${numero}`, nome: `Cenário ${String.fromCharCode(64 + numero)}`, quantidadeDados: 1, quantidadeFaces: 20, bonus: 0, cor: CORES_CENARIOS[(numero - 1) % CORES_CENARIOS.length] }];
        });
    }, []);

    const removerCenario = useCallback((cenarioId: string) => {
        setCenarios(atuais => atuais.length > 1 ? atuais.filter(cenario => cenario.id !== cenarioId) : atuais);
    }, []);

    const adicionarLimiar = useCallback(() => {
        if (!Number.isSafeInteger(novoLimiar) || limiares.includes(novoLimiar)) return;
        setLimiares(atuais => [...atuais, novoLimiar].sort((a, b) => a - b));
    }, [limiares, novoLimiar]);

    const removerLimiar = useCallback((limiar: number) => {
        setLimiares(atuais => atuais.filter(valor => valor !== limiar));
    }, []);

    return { cenarios, limiares, novoLimiar, alterarCenario, adicionarCenario, removerCenario, setNovoLimiar, adicionarLimiar, removerLimiar };
};
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PatentePericiaCompletaDto } from 'types-nora-api';
import { LIMITES_ANALISE_TESTE_PERICIA } from 'types-nora-api';

import type { AlteracoesCenarioSimuladorTestePericiaUdm, CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';

const CORES_CENARIOS = ['#f6d16d', '#6dc8f6', '#b98cff', '#75df9b', '#ff8f70', '#f58fd2', '#8ce0d3', '#d5dc75'] as const;

export function useConfiguracaoSimuladorTestePericiaUdm(patentes: readonly PatentePericiaCompletaDto[]) {
    const [cenarios, setCenarios] = useState<readonly CenarioSimuladorTestePericiaUdm[]>([]);
    const [resultadosAlvo, setResultadosAlvo] = useState<readonly number[]>([10, 15, 20, 25]);
    const [novoResultadoAlvo, setNovoResultadoAlvo] = useState(0);
    const inicializado = useRef(false);
    const proximoId = useRef(4);

    useEffect(() => {
        if (inicializado.current || patentes.length === 0) return;
        inicializado.current = true;
        setCenarios(criaCenariosIniciais(patentes));
    }, [patentes]);

    const alterarCenario = useCallback((cenarioId: string, alteracoes: AlteracoesCenarioSimuladorTestePericiaUdm) => {
        setCenarios(atuais => atuais.map(cenario => cenario.id === cenarioId ? { ...cenario, ...alteracoes } : cenario));
    }, []);

    const adicionarCenario = useCallback(() => {
        setCenarios(atuais => {
            if (atuais.length >= LIMITES_ANALISE_TESTE_PERICIA.quantidadeCenariosMaxima || patentes.length === 0) return atuais;
            const numero = proximoId.current;
            proximoId.current += 1;
            return [...atuais, criaCenario(numero, patentes[0].id, 1, 0)];
        });
    }, [patentes]);

    const removerCenario = useCallback((cenarioId: string) => {
        setCenarios(atuais => atuais.length > 1 ? atuais.filter(cenario => cenario.id !== cenarioId) : atuais);
    }, []);

    const adicionarResultadoAlvo = useCallback(() => {
        if (!Number.isSafeInteger(novoResultadoAlvo) || Math.abs(novoResultadoAlvo) > LIMITES_ANALISE_TESTE_PERICIA.resultadoAlvoAbsolutoMaximo || resultadosAlvo.includes(novoResultadoAlvo) || resultadosAlvo.length >= LIMITES_ANALISE_TESTE_PERICIA.quantidadeResultadosAlvoMaxima) return;
        setResultadosAlvo(atuais => [...atuais, novoResultadoAlvo].sort((primeiro, segundo) => primeiro - segundo));
    }, [novoResultadoAlvo, resultadosAlvo]);

    const removerResultadoAlvo = useCallback((resultadoAlvo: number) => {
        setResultadosAlvo(atuais => atuais.filter(valor => valor !== resultadoAlvo));
    }, []);

    return { cenarios, resultadosAlvo, novoResultadoAlvo, alterarCenario, adicionarCenario, removerCenario, setNovoResultadoAlvo, adicionarResultadoAlvo, removerResultadoAlvo };
};

function criaCenariosIniciais(patentes: readonly PatentePericiaCompletaDto[]): readonly CenarioSimuladorTestePericiaUdm[] {
    const ordenadas = [...patentes].sort((primeira, segunda) => primeira.id - segunda.id);
    return [criaCenario(1, ordenadas[0].id, 0, 0), criaCenario(2, ordenadas[Math.min(1, ordenadas.length - 1)].id, 2, 0), criaCenario(3, ordenadas[Math.min(2, ordenadas.length - 1)].id, 4, 0)];
};

function criaCenario(numero: number, idPatentePericia: number, valorAtributoBase: number, incrementoModificadoresValorMaximo: number): CenarioSimuladorTestePericiaUdm {
    return { id: `cenario-${numero}`, nome: `Cenário ${String.fromCharCode(64 + numero)}`, cor: CORES_CENARIOS[(numero - 1) % CORES_CENARIOS.length], valorAtributoBase, incrementoModificadoresAtributo: 0, idPatentePericia, incrementoModificadoresValorMaximo };
};
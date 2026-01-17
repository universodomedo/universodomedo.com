'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export interface ContadorRegressivoProps {
    dataAlvo: Date | string | number;
    onTerminou?: () => void;
};

export function ContadorRegressivo({ dataAlvo, onTerminou }: ContadorRegressivoProps) {
    const { tempoRestante } = useContadorRegressivo({ dataAlvo, onTerminou });
    return tempoRestante;
};

export function useContadorRegressivo({ dataAlvo, onTerminou }: ContadorRegressivoProps) {
    const [diferencaMs, setDiferencaMs] = useState<number>(0);
    const terminouDisparadoRef = useRef(false);

    const dataFinal = useMemo(() => {
        const date = new Date(dataAlvo);
        return isNaN(date.getTime()) ? new Date('invalid') : date;
    }, [dataAlvo]);

    const atualizar = useCallback(() => {
        const time = dataFinal.getTime();

        if (isNaN(time)) {
            setDiferencaMs(NaN);
            return;
        }

        const agora = new Date();
        const diferenca = time - agora.getTime();

        setDiferencaMs(diferenca);

        if (diferenca <= 0 && !terminouDisparadoRef.current) {
            terminouDisparadoRef.current = true;
            if (onTerminou) onTerminou();
        }

        if (diferenca > 0) terminouDisparadoRef.current = false;
    }, [dataFinal, onTerminou]);

    useEffect(() => {
        atualizar();
        const time = dataFinal.getTime();
        if (isNaN(time)) return;
        const intervalo = setInterval(atualizar, 1000);
        return () => clearInterval(intervalo);
    }, [atualizar, dataFinal]);

    const tempoRestante = useMemo(() => formatarDiferencaParaHMS(diferencaMs), [diferencaMs]);

    return { tempoRestante, diferencaMs, dataFinal };
};

function formatarDiferencaParaHMS(diferencaMs: number) {
    if (Number.isNaN(diferencaMs)) return '--:--:--';

    const ms = Math.max(diferencaMs, 0);
    const horas = Math.floor(ms / (1000 * 60 * 60));
    const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((ms % (1000 * 60)) / 1000);

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
};
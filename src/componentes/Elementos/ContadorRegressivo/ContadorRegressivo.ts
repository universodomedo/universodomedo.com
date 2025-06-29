import { useState, useEffect, useMemo } from 'react';

interface ContadorRegressivoProps {
    dataAlvo: Date | string | number;
    onTerminou?: () => void;
}

export function ContadorRegressivo({ dataAlvo, onTerminou }: ContadorRegressivoProps) {
    const [tempoRestante, setTempoRestante] = useState<string>('--:--:--');

    const dataFinal = useMemo(() => {
        const date = new Date(dataAlvo);
        return isNaN(date.getTime()) ? null : date;
    }, [dataAlvo]);

    useEffect(() => {
        if (!dataFinal) {
            setTempoRestante('Data inválida');
            return;
        }

        const atualizarContador = () => {
            const agora = new Date();
            const diferenca = dataFinal.getTime() - agora.getTime();

            if (diferenca <= 0) {
                setTempoRestante('00:00:00');
                if (onTerminou) onTerminou();
                return;
            }

            const horas = Math.floor(diferenca / (1000 * 60 * 60));
            const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

            setTempoRestante(
                `${horas.toString().padStart(2, '0')}:` +
                `${minutos.toString().padStart(2, '0')}:` +
                `${segundos.toString().padStart(2, '0')}`
            );
        };

        atualizarContador();
        const intervalo = setInterval(atualizarContador, 1000);

        return () => clearInterval(intervalo);
    }, [dataFinal, onTerminou]);

    return tempoRestante;
}
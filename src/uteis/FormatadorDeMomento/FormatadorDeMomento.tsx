import { FormatoMomento } from "types-nora-api";

export function formataDuracao(duracaoEmSegundos: number, formato: FormatoMomento): string {
    const horas = Math.floor(duracaoEmSegundos / 3600);
    const minutos = Math.floor((duracaoEmSegundos % 3600) / 60);
    const segundos = duracaoEmSegundos % 60;

    switch (formato) {
        case FormatoMomento.HMS:
            const hh = String(horas).padStart(2, '0');
            const mm = String(minutos).padStart(2, '0');
            const ss = String(segundos).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;

        case FormatoMomento.EXTENSO:
            const partes: string[] = [];
            if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`);
            if (minutos > 0) partes.push(`${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`);
            if (segundos > 0 || partes.length === 0) partes.push(`${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`);
            if (partes.length > 1) {
                const ultimo = partes.pop();
                return partes.join(', ') + ' e ' + ultimo;
            }
            return partes[0];

        case FormatoMomento.EXTENSO_APROXIMADO:
            if (duracaoEmSegundos < 60) return 'instantes';
            if (duracaoEmSegundos < 3600) return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
            return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
}
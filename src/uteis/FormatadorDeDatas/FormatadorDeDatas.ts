import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

// Formata para "dd/MM/yyyy HH:mm:ss" (Brasil)
export function formatarDataBR(data: Date | string): string {
    try {
        // Converte para Date se for string
        const dataObj = typeof data === 'string' ? new Date(data) : data;

        // Verifica se é uma data válida
        if (isNaN(dataObj.getTime())) return 'Data inválida';

        // Converte para o fuso horário de Brasília
        const dataBrasilia = toZonedTime(dataObj, 'America/Sao_Paulo');

        // Formata no padrão BR
        return format(dataBrasilia, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch {
        return 'Erro ao formatar';
    }
}
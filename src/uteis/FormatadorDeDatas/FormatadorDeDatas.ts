import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

export function formataData(data: Date | string, formato?: string, utc?: boolean): string {
    try {
        // Converte para Date se for string
        const dataObj = typeof data === 'string' ? new Date(data) : data;

        // Verifica se é uma data válida
        if (isNaN(dataObj.getTime())) return 'Data inválida';

        // Converte para o fuso horário de Brasília
        const dataBrasilia = toZonedTime(dataObj, utc ? 'UTC' : 'America/Sao_Paulo');

        // Formata no padrão BR
        return format(dataBrasilia, formato ? formato : "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch {
        return 'Erro ao formatar';
    }
};
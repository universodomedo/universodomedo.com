// Formata milissegundos como m:ss.mmm (ex.: 37545 -> "0:37.545"). Funcao pura compartilhada pelos componentes do editor.
export function formatarMs(ms: number): string {
    const totalSegundos = Math.max(0, ms) / 1000;
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = Math.floor(totalSegundos % 60);
    const milis = Math.floor(Math.max(0, ms) % 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}.${milis.toString().padStart(3, '0')}`;
};

// Converte uma posicao horizontal (0..1 dentro da faixa) para milissegundos, limitando ao intervalo [0, duracaoMs].
export function fracaoParaMs(fracao: number, duracaoMs: number): number { return Math.round(Math.min(1, Math.max(0, fracao)) * duracaoMs); };

// Converte milissegundos para porcentagem (0..100) da faixa, para posicionar elementos na timeline.
export function msParaPercentual(ms: number, duracaoMs: number): number { return duracaoMs <= 0 ? 0 : Math.min(100, Math.max(0, (ms / duracaoMs) * 100)); };

// Converte um texto de tempo em ms: aceita ms puro ("12761"), "ss.mmm" ("51.772") ou "m:ss.mmm" ("1:04.611"). Retorna null se invalido.
export function parseTimecode(texto: string): number | null {
    const limpo = texto.trim();
    if (limpo === '') return null;
    if (/^\d+$/.test(limpo)) return Number(limpo);
    const partes = limpo.match(/^(?:(\d+):)?(\d{1,2})(?:[.,](\d{1,3}))?$/);
    if (!partes) return null;
    const minutos = partes[1] ? Number(partes[1]) : 0;
    const segundos = Number(partes[2]);
    const milis = partes[3] ? Number(partes[3].padEnd(3, '0')) : 0;
    return (minutos * 60 + segundos) * 1000 + milis;
};

// Escolhe um intervalo "redondo" de marcacao da regua para o trecho visivel (~8 marcas).
export function intervaloRegua(spanVisivelMs: number): number {
    const alvo = Math.max(1, spanVisivelMs) / 8;
    const intervalos = [100, 250, 500, 1000, 2000, 5000, 10000, 15000, 30000, 60000, 120000, 300000];
    return intervalos.find(intervalo => intervalo >= alvo) ?? 300000;
};

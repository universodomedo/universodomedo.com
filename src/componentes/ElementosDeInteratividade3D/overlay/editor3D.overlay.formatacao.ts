export function formataDeltaEditor3D(valor: number): string {
    const valorAbsoluto = Math.abs(valor);
    const sinal = valor < 0 ? '-' : '+';

    return `${sinal}${valorAbsoluto.toFixed(2)}`;
};

export function formataDeltaRotacaoEditor3D(valor: number): string {
    const graus = valor * (180 / Math.PI);
    const valorAbsoluto = Math.abs(graus);
    const sinal = graus < 0 ? '-' : '+';

    return `${sinal}${valorAbsoluto.toFixed(1)}°`;
};
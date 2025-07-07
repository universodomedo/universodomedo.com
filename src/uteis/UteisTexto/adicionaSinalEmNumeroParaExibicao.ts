export default function adicionaSinalEmNumeroParaExibicao(numero: number): string {
    return numero > 0 ? `+${numero}` : `${numero}`;
}
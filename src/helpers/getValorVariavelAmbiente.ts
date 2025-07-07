import { VariavelAmbienteDto } from "types-nora-api";

export default function getValorVariavelAmbiente<T = any>(variaveis: VariavelAmbienteDto[], chave: string): T | undefined {
    const variavel = variaveis.find(v => v.chave === chave);
    if (!variavel) return undefined;

    const { tipo, valor } = variavel;

    switch (tipo) {
        case 'boolean':
            return (valor === true || valor === 'true') as T;
        case 'number':
            return Number(valor) as T;
        case 'string':
            return String(valor) as T;
        default:
            return valor as T;
    }
}
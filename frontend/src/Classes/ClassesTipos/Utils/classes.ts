export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

export const adicionaSinalEmNumeroParaExibicao = (numero: number): string => {
    return numero > 0 ? `+${numero}` : `${numero}`;
}

export function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}
// #region Imports
// import { Ritual, Item, Habilidade, Acao, Modificador, HabilidadePassiva } from 'Classes/ClassesTipos/index.ts';
// #endregion

export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

export const adicionaSinalEmNumeroParaExibicao = (numero: number): string => {
    return numero > 0 ? `+${numero}` : `${numero}`;
}

// export function adicionarModificadoresUtil<T extends Acao | HabilidadePassiva | Item>(instancia: T, lista: Modificador[], propsModificador: ConstructorParameters<typeof Modificador>[0][]): void {
//     propsModificador.forEach(props => {
//         const novoModificador = new Modificador(props).adicionaRefPai(instancia);

//         lista.push(novoModificador);
//     });
// }

export function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}
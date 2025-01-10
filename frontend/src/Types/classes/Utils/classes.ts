// #region Imports
import { Ritual, Item, Habilidade, Acao, Modificador, HabilidadePassiva } from 'Types/classes/index.ts';
// #endregion

export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

export function adicionarAcoesUtil<T extends Ritual | Item | Habilidade>(instancia: T, lista: Acao[], acoes: { props: ConstructorParameters<typeof Acao>, config?: (acao: Acao) => void }[]): void {
    acoes.forEach(({ props, config }) => {
        const novaAcao = new Acao(...props).adicionaRefPai(instancia);

        if (config !== undefined) config(novaAcao);

        lista.push(novaAcao);
    });
}

export function adicionarModificadoresUtil<T extends Acao | HabilidadePassiva | Item>(instancia: T, lista: Modificador[], propsModificador: ConstructorParameters<typeof Modificador>[0][]): void {
    propsModificador.forEach(props => {
        const novoModificador = new Modificador(props).adicionaRefPai(instancia);

        lista.push(novoModificador);
    });
}

export function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}
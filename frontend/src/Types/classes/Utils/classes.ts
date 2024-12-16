// #region Imports
import { Ritual, Item, Habilidade, Acao, Buff } from 'Types/classes/index.ts';
// #endregion

export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

export function adicionarAcoesUtil<T extends Ritual | Item | Habilidade>(instancia: T, acoes: Acao[], acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): void {
    acaoParams.forEach(([AcaoClass, params, configurarAcao]) => {
        const acao = new AcaoClass(...params, instancia).adicionaRefPai(instancia);

        if (configurarAcao) configurarAcao(acao);

        acoes.push(acao);
    });
}

export function adicionarBuffsUtil<T extends Acao | Item | Habilidade>(instancia: T, buffs: Buff[], buffParams: [new (...args: any[]) => Buff, any[]][]): void {
    buffParams.forEach(([BuffClass, params]) => {
        const buff = new BuffClass(...params, instancia);

        buffs.push(buff);
    });
}

export function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}
// #region Imports
import { Ritual, Item, Habilidade, Acao, Efeito, Modificador } from 'Types/classes/index.ts';
// #endregion

export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

export function adicionarAcoesUtil<T extends Ritual | Item | Habilidade>(instancia: T, lista: Acao[], acoes: { props: ConstructorParameters<typeof Acao>, config: (acao: Acao) => void }[]): void {
    acoes.forEach(({ props, config }) => {
        const novaAcao = new Acao(...props).adicionaRefPai(instancia);

        config(novaAcao);

        lista.push(novaAcao);
    });
}

export function adicionarEfeitosUtil<T extends Acao | Item | Habilidade>(instancia: T, lista: Efeito[], efeitos: { props: ConstructorParameters<typeof Efeito> }[]): void {
    efeitos.forEach(({ props }) => {
        const novoEfeito = new Efeito(...props);

        lista.push(novoEfeito);
    })
}

export function adicionarModificadoresUtil<T extends Acao | Item | Habilidade>(instancia: T, lista: Modificador[]): void {
    const novoModificador = new Modificador('teste', 3, 1, [new Efeito(1, 1, 2)], { dadosComportamentoPassivo: [false]});

    lista.push(novoModificador);
}

// export function adicionarBuffsUtil<T extends Acao | Item | Habilidade>(instancia: T, buffs: Buff[], buffParams: [new (...args: any[]) => Buff, any[]][]): void {
//     buffParams.forEach(([BuffClass, params]) => {
//         const buff = new BuffClass(...params, instancia);

//         buffs.push(buff);
//     });
// }

export function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}
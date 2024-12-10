// #region Imports
import { Item, Acao, Buff} from 'Types/classes/index.ts';
import { FichaHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Inventario {
    public items: Item[] = [];

    constructor() { }

    get agrupamento(): Item[] {
        return [
            ...(this.items.reduce((itemAgrupado, itemAtual) => {
                if (!itemAtual.agrupavel || !itemAgrupado.some(item => item.agrupavel && item.nomeExibicao === itemAtual.nomeExibicao && !item.comportamentoEmpunhavel.estaEmpunhado)) {
                    itemAgrupado.push(itemAtual);
                }
                return itemAgrupado;
            }, [] as typeof this.items)),
        ]
    }

    get espacosUsados(): number {
        return this.items.reduce((acc, cur) => { return acc + cur.peso }, 0)
    }

    public adicionarItemNoInventario = (item: Item): void => {
        this.items.push(item);
    }

    public acoesInventario = (): Acao[] => {
        return this.items.reduce((acc: Acao[], item) => acc.concat(item.acoes), []);
    }

    public buffsInventario = (): Buff[] => {
        return this.items.reduce((acc: Buff[], item) => acc.concat(item.buffs), []);
    }

    public verificaCarregandoComponente(idElemento: number, idNivelComponente: number): boolean {
        return true;
        // return this.items.some(item => item instanceof ItemComponente && item.detalhesComponente.refElemento.id === idElemento && item.detalhesComponente.refNivelComponente.id === idNivelComponente);
    }

    public removerItem(idItem: number): void {
        this.items = this.items.filter(item => item.id !== idItem);
    }
}

export class GerenciadorEspacoCategoria {
    constructor(public espacosCategoria: EspacoCategoria[]) { }

    numeroItensCategoria(valorCategoria: number): number {
        return FichaHelper.getInstance().personagem.inventario.items.filter(item => item.categoria === valorCategoria).length;
    }
}

export class EspacoCategoria {
    constructor(
        public valorCategoria: number,
        public maximoEspacosCategoria: number,
    ) { }

    get nomeCategoria(): string {
        return `Categoria ${this.valorCategoria}`;
    }
}

export class EspacoInventario {
    constructor(
        public valorNatural: number,
        public valorAdicionalPorForca: number,
    ) { }

    get espacoTotal(): number { return this.valorNatural + this.espacoAdicionalPorFoca + this.espacoAdicional }
    get espacoAdicional(): number { return FichaHelper.getInstance().personagem.buffsAplicados.buffPorId(52); }
    get espacoAdicionalPorFoca(): number { return this.valorAdicionalPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal! }
}
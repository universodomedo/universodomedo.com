// #region Imports
import { Acao, AcaoRitual, ItemComponente, Item, Opcao, OpcoesExecucao } from 'Types/classes/index.ts';
import { FichaHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export abstract class Requisito {
    constructor() { }
    abstract get requisitoCumprido(): boolean;
    abstract get descricaoRequisito(): string;

    public refAcao?: Acao;
    setRefAcao(value: Acao): this { return (this.refAcao = value, this); }
}

export class RequisitoComponente extends Requisito {
    constructor(public precisaEstarEmpunhando: boolean) { super(); }

    public refAcao?: AcaoRitual;
    setRefAcao(value: AcaoRitual): this { this.refAcao = value; return this; }

    get requisitoCumprido(): boolean {
        return (
            FichaHelper.getInstance().personagem.inventario.items.some(item =>
                item instanceof ItemComponente && item.detalhesComponente.refElemento.id === this.refAcao!.refPai.refElemento.id && item.detalhesComponente.refNivelComponente.id === this.refAcao!.refPai.refNivelComponente.id
                && (this.precisaEstarEmpunhando && item.refExtremidade)
            )
        );
    }

    get descricaoRequisito(): string {
        return !this.precisaEstarEmpunhando
            ? 'Necessário ter o Componente'
            : 'Necessário empunhar o Componente';
    }
}

export class RequisitoItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return (this.refAcao!.refPai instanceof Item && this.refAcao!.refPai.estaEmpunhado); }
    get descricaoRequisito(): string { return 'Necessário empunhar o Item da Ação'; }
}

// export class RequisitoItemGuardado extends Requisito {

// }

export class RequisitoExtremidadeDisponivel extends Requisito {
    constructor() { super(); }

    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.some(extremidade => !extremidade.refItem); }

    get descricaoRequisito(): string { return 'Nessário Extremidade Disponível'; }
}

export class RequisitoAlgumItemGuardado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.inventario.items.some(item => !item.refExtremidade); }
    get descricaoRequisito(): string { return 'Necessário ter Item no Inventário'; }
}

export class RequisitoAlgumItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.inventario.items.some(item => item.refExtremidade); }
    get descricaoRequisito(): string { return 'Necessário Empunhar algum Item'; }
}

export class RequisitoPodeSeLocomover extends Requisito {
    get requisitoCumprido(): boolean { return true; }
    get descricaoRequisito(): string { return 'Necessário Livre para se Locomover'; }
}

export class TipoRequisito {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

type RequisitoOption = { key: string; displayName: string; obterOpcoes: (acao: Acao) => Opcao[] };

export class RequisitoConfig {
    private static requisitoMap: Map<number, { 
        requisitoClass: new (...args: any[]) => Requisito, 
        requisitoParams: any[], // Permitir parâmetros adicionais 
        opcoesExecucao: RequisitoOption[] 
    }> = new Map([
        [1, {
            requisitoClass: RequisitoComponente,
            requisitoParams: [true], // Parametro booleano esperado pelo RequisitoComponente
            opcoesExecucao: [
                {
                    key: 'custoComponente',
                    displayName: 'Componente',
                    obterOpcoes: (acao: Acao) => {
                        const acaoRitual = acao as AcaoRitual;
                        return FichaHelper.getInstance().personagem.inventario.items.filter(item => item.refExtremidade && item instanceof ItemComponente && item.detalhesComponente.refElemento.id === acaoRitual.refPai.refElemento.id && item.detalhesComponente.refNivelComponente.id === acaoRitual.refPai.refCirculoNivelRitual.idCirculo).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicaoOption });
                            return acc;
                        }, []);
                    }
                }
            ]
        }],
        // Outros requisitos podem ser adicionados aqui
    ]);

    // Método para construir requisito e opções, incluindo `setRefAcao` e parâmetros adicionais
    static construirRequisitoEOpcoesPorId(id: number, acao: Acao) {
        const config = this.requisitoMap.get(id);
        if (!config) return null;

        // Cria o requisito com os parâmetros e chama `setRefAcao`
        const requisito = new config.requisitoClass(...config.requisitoParams).setRefAcao(acao as AcaoRitual);
        const opcoesExecucao = config.opcoesExecucao.map(opcao => 
            new OpcoesExecucao(opcao.key, opcao.displayName, () => opcao.obterOpcoes(acao))
        );

        return { requisito, opcoesExecucao };
    }
}
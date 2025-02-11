export type ClasseModelo = {
    id: number;
    nome: string;
    descricao: string;
};

export type Classe = ClasseModelo;

export type NivelModelo = {
    id: number;
    nome: string;
};

export type Nivel = NivelModelo & {
    readonly nomeDisplay: string;
};





// export class Personagem {
//     public reducoesDano: ReducaoDano[] = [];

//     constructor(public dadosFicha: RLJ_Ficha2) {

//         this.reducoesDano = this.dadosFicha.reducoesDano?.map(reducao_dano => new ReducaoDano(reducao_dano.idTipoDano, reducao_dano.valor))!;
//     }

//     get pontosDeSanidadeSacrificadosPorRituais(): number { return this.rituais.reduce((acc, cur) => acc + cur.comportamentos.comportamentoRitual.refCirculoNivelRitual.psSacrificados, 0) }

//     public onUpdate: () => void = () => { };

//     // receberDanoVital = (danoGeral:DanoGeral) => {
//     //     this.controladorPersonagem.reduzDano(danoGeral);
//     // }

//     public rodaDuracao = (idDuracao: number) => {
//         // LoggerHelper.getInstance().adicionaMensagem(`Rodou ${SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === idDuracao)?.nome}`);

//         // this.obterBuffs().filter(buff => buff.ativo).map(buff => {
//         //     if (buff.refDuracao.id === idDuracao) {
//         //         buff.reduzDuracao();
//         //     } else if (buff.refDuracao.id < idDuracao) {
//         //         buff.desativaBuff();
//         //     }
//         // });

//         // if (idDuracao >= 2) this.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());

//         // LoggerHelper.getInstance().saveLog();

//         this.onUpdate();
//     }

//     public carregaOnUpdate = (callback: () => void) => {
//         this.onUpdate = callback;
//     }
// }

// export class Classe {
//     constructor(
//         public id: number,
//         public nome: string,
//         public descricao: string,
//     ) { }
// }

// export class Nivel {
//     constructor(
//         public id: number,
//         public nome: string,
//     ) { }

//     get nomeDisplay(): string { return `NEX ${this.nome}%` }
// }
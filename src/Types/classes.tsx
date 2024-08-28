import CheckboxComponent from "Components/SubComponents/CheckBoxValue/page.tsx";
import { MDL_Atributo, MDL_AtributoPersonagem, MDL_EstatisticaDanificavel, MDL_PatentePericia, MDL_Pericia, MDL_Personagem, MDL_TipoDano, RLJ_AtributoPersonagem_Atributo, RLJ_EstatisticasDanificaveisPersonagem_Estatistica, RLJ_Ficha, RLJ_PericiasPatentesPersonagem_Pericia_Patente, RLJ_ReducaoDanoPersonagem_TipoDano, MDL_CaracteristicaArma } from "udm-types";

export class Personagem {
    private _ficha!:RLJ_Ficha;
    public reducoesDano:ReducaoDano[];
    public atributos:Atributo[];
    public pericias:Pericia[];
    public buffs:Buff[] = [];
    public inventario:Item[];
    // public estatisticas:Estatisticas;
    public detalhes:CharacterDetalhes;
    public controladorPersonagem:ControladorPersonagem;

    //
    public onUpdate: () => void = () => {};
    carregaOnUpdate = (callback: () => void) => {
        this.onUpdate = callback;
    }
    //

    // constructor(estatisticas:Estatisticas, atributos:Atributo[], detalhes:CharacterDetalhes, reducoesDano:ReducaoDano[], estatisticasDanificaveisPersonagem:EstatisticasDanificaveisPersonagem) {
    constructor(db_ficha:RLJ_Ficha) {
        this._ficha = db_ficha;

        this.reducoesDano = this._ficha.reducoesDano.map(reducaoDano => new ReducaoDano(reducaoDano.valor, reducaoDano.tipoDano, this));
        this.atributos = this._ficha.atributos.map(attr => new Atributo(attr.valor, attr.atributo, this));
        this.pericias = this._ficha.periciasPatentes.map(periciaPatente => new Pericia(periciaPatente.pericia, periciaPatente.patente, this));
        this.inventario = [new Item("Teste", 2, 0)];

        // this.estatisticas = estatisticas;
        this.detalhes = new CharacterDetalhes(this._ficha.detalhe.nome, this._ficha.detalhe.classe.nome, this._ficha.detalhe.nivel.nex);

        const estatisticasDanificaveis = new EstatisticasDanificaveisPersonagem(
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 1)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor, teste.valorMaximo, teste.estatisticaDanificavel);
            })(),
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 2)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor, teste.valorMaximo, teste.estatisticaDanificavel);
            })(),
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 3)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor, teste.valorMaximo, teste.estatisticaDanificavel);
            })(),
        );

        this.controladorPersonagem = new ControladorPersonagem(estatisticasDanificaveis, this.reducoesDano);
    }

    receberDanoVital = (danoGeral:DanoGeral) => {
        this.controladorPersonagem.reduzDano(danoGeral);
    }
}

export class EstatisticaDanificavel implements RLJ_EstatisticasDanificaveisPersonagem_Estatistica {
    constructor(
        public idEstatisticaDanificavel: number,
        public idPersonagem: number,
        public valor: number,
        public valorMaximo: number,
        public estatisticaDanificavel: MDL_EstatisticaDanificavel
    ) {}

    public aplicarDanoFinal(valor: number): void {
        console.log(`Foram perdidos ${valor} pontos de ${this.estatisticaDanificavel.nomeAbrev}!`);
        this.valor = Math.max(this.valor - valor, 0);
    }
    public aplicarCura(valor: number): void {
        console.log(`Foram ganhos ${valor} pontos de ${this.estatisticaDanificavel.nomeAbrev}!`);
        this.valor = Math.min(this.valor + valor, this.valorMaximo);
    }
}

export class ReducaoDano {
    constructor(
        public valor: number,
        public tipoDano: MDL_TipoDano,
        private refPersonagem:Personagem
    ) {}

    get valorBonus():number {
        return this.refPersonagem.buffs.filter(buff => buff.idRefBuff === this.tipoDano.idBuff).reduce((acc, cur) => {
            return acc + cur.valor;
        }, 0);
    }

    get valorTotal():number {
        return this.valor + this.valorBonus;
    }
}

export class Atributo {
    constructor (
        public valor:number,
        public atributo:MDL_Atributo,
        private refPersonagem:Personagem
    ) {}

    get valorBonus():number {
        return this.refPersonagem.buffs.filter(buff => buff.idRefBuff === this.atributo.idBuff).reduce((acc, cur) => {
            return acc + cur.valor;
        }, 0);
    }

    get valorTotal():number {
        return this.valor + this.valorBonus;
    }
}

export class Pericia {
    constructor (
        public pericia:MDL_Pericia,
        public patente:MDL_PatentePericia,
        private refPersonagem:Personagem
    ) {}
    
    get valorBonus():number {
        return this.refPersonagem.buffs.filter(buff => buff.idRefBuff === this.pericia.idBuff).reduce((acc, cur) => {
            return acc + cur.valor;
        }, 0);
    }

    get valorTotal():number {
        return this.patente.valor + this.valorBonus;
    }
}

export class Buff {
    constructor(
        public idRefBuff:number,
        public valor:number
    ) {}
}


// ================================================= //

export class Item {
    constructor(
        public nome:string,
        public peso:number,
        public categoria:number,
        // public açoes
        // public buffs
    ) {}
}

export class Arma extends Item {
    public dano:number;
    public variancia:number;
    public caracteristicas:MDL_CaracteristicaArma[] = [];

    constructor(nome:string, peso:number, categoria:number, dano:number, variancia:number) {
        super(nome, peso, categoria);
        this.dano = dano;
        this.variancia = variancia;
    }
}

// ================================================= //




export class ValorBuffavel {
    obterBonus = (idBuff:number):number => {
        return listaBonus.filter(bonus => bonus.id === idBuff).reduce((acc, cur) => {
            return (cur.checked ? acc + cur.valor : acc);
        }, 0);
    }
}

export class EstatisticasDanificaveisPersonagem {
    public pv:EstatisticaDanificavel;
    public ps:EstatisticaDanificavel;
    public pe:EstatisticaDanificavel;

    constructor(pv:EstatisticaDanificavel, ps:EstatisticaDanificavel, pe:EstatisticaDanificavel) {
        this.pv = pv;
        this.ps = ps;
        this.pe = pe;
    }

    obterListaEstatisticasDanificaveis = ():EstatisticaDanificavel[] => {
        return [this.pv, this.ps, this.pe];
    }
}

export class ControladorPersonagem {
    public estatisticasDanificaveis:EstatisticasDanificaveisPersonagem;
    public rds:ReducaoDano[] = [];

    constructor(estatisticasDanificaveisPersonagem:EstatisticasDanificaveisPersonagem, rds:ReducaoDano[]) {
        this.estatisticasDanificaveis = estatisticasDanificaveisPersonagem;
        this.rds = rds;
    }

    reduzDano = (danoGeral:DanoGeral) => {
        let dano:number = 0;
        // danoGeral.listaDano.forEach(instanciaDano => {
        //     const rd = this.rds.find(rd => rd.tipo.id === instanciaDano.tipoDano.id);
        //     console.log(`Recebi ${instanciaDano.valor} de Dano ${instanciaDano.tipoDano.nome}, tendo ${rd!.valor} de RD`);
        //     dano += instanciaDano.valor - rd!.valor;
        // });

        console.log("1");
        let somaDanoNivel1 = 0;
        listaTiposDano.filter(tipoDano => !tipoDano.idTipoDanoPertencente).map(tipoDanoNivel1 => {
            let somaDanoNivel2 = 0;
            listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel1.id).map(tipoDanoNivel2 => {
                let somaDanoNivel3 = 0;
                listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel2.id).map(tipoDanoNivel3 => {
                    const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel3.id);
                    if (danoDoTipo) somaDanoNivel3 += Math.max(danoDoTipo.valor - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel3.id)!.valor, 0);
                });
                const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel2.id);
                somaDanoNivel2 += Math.max((somaDanoNivel3 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel2.id)!.valor, 0);
            });
            const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel1.id);
            somaDanoNivel1 += Math.max((somaDanoNivel2 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel1.id)!.valor, 0);
        });

        this.estatisticasDanificaveis.pv.aplicarDanoFinal(somaDanoNivel1);
    }
}



export class DanoGeral { // traduz em 1 unico ataque
    public listaDano:InstanciaDano[]; // são as diferentes composições dentro desse unico ataque

    constructor(listaDano:InstanciaDano[]) {
        this.listaDano = listaDano;
    }
}

export class InstanciaDano {
    public valor:number;
    public tipoDano:TipoDano;

    constructor(valor:number, tipoDano:TipoDano) {
        this.valor = valor;
        this.tipoDano = tipoDano;
    }
}



export class ReducaoDanoa {
    public tipo:TipoDano;
    public valor:number;

    constructor(tipo:TipoDano, valor:number) {
        this.tipo = tipo;
        this.valor = valor;
    }
}

export class TipoDano {
    public id:number;
    public nome:string;
    public danoPertencente?:TipoDano;
    // estatistica alvo

    constructor(id:number, nome:string) {
        this.id = id;
        this.nome = nome;
    }
}

export const listaTiposDano:MDL_TipoDano[] = [];

// export const listaTiposDano:TipoDano[] = [];

export class SimboloEfeito {
    pathData: string;

    constructor(pathData: string) {
        this.pathData = pathData;
    }

    setPathData(path: string) {
        this.pathData = path;
    }

    getPathData() {
        return this.pathData;
    }

    toSvg(): string {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                <rect width="100" height="100" />
                <path d="${this.pathData}" stroke="white" stroke-width="5" stroke-linecap="round" fill="none" />
            </svg>
        `.replace(/\s+/g, ' ').trim(); // Minify the SVG string

        // Properly encode the SVG
        const encodedSvg = encodeURIComponent(svg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');

        return `data:image/svg+xml,${encodedSvg}`;
    }
}

export class BonusConectado {
    public id:number;
    public valor:number;
    public descricao:string;
    public valorBuffavel:string;
    public checked:boolean;
    public componente:React.FC<{ onChange: (checked: boolean) => void; checked: boolean }>;
    public simboloEfeito:SimboloEfeito;

    constructor(id:number, descricao:string, valorBuffavel:string, valor:number) {
        this.id = id;
        this.valor = valor;
        this.descricao = descricao;
        this.valorBuffavel = valorBuffavel;
        this.checked = false;
        this.componente = ({ onChange, checked }) => (
            <CheckboxComponent valor={this.valor} descricao={this.descricao} valorBuffavel={this.valorBuffavel} onChange={onChange} checked={checked} />
        )

        this.simboloEfeito = new SimboloEfeito("M37.8125,49 M37.8125,49 M37.8125,48 M37.8125,47 M36.8125,47 M36.8125,46 M36.8125,45 M36.8125,44 M35.8125,43 M35.8125,42 M35.8125,41 M35.8125,40 M35.8125,39 M35.8125,38 M35.8125,37 M35.8125,36 M35.8125,35 M35.8125,34 M35.8125,33 M35.8125,32 M35.8125,31 M35.8125,30 M35.8125,29 M35.8125,28 M35.8125,27 M35.8125,26 M35.8125,25 M35.8125,24 M35.8125,23 M36.8125,23 M37.8125,23 M38.8125,23 M39.8125,24 M39.8125,25 M40.8125,25 M41.8125,25 M41.8125,26 M42.8125,26 M43.8125,27 M44.8125,27 M45.8125,27 M45.8125,28 M46.8125,28 M46.8125,29 M47.8125,29 M48.8125,29 M49.8125,29 M49.8125,30 M50.8125,30 M51.8125,30 M51.8125,31 M52.8125,31 M53.8125,31 M54.8125,31 M54.8125,32 M55.8125,32 M55.8125,33 M56.8125,33 M57.8125,33 M57.8125,34 M58.8125,34 M59.8125,34 M59.8125,35 M59.8125,36 M60.8125,36 M60.8125,37 M61.8125,37 M62.8125,37 M62.8125,38 M63.8125,38 M63.8125,39 M63.8125,40 M63.8125,41 M63.8125,42 M63.8125,43 M63.8125,44 M63.8125,45 M63.8125,46 M63.8125,47 M63.8125,48 M63.8125,49 M63.8125,50 M63.8125,51 M62.8125,51 M62.8125,52 M61.8125,52 M61.8125,53 M61.8125,54 M60.8125,54 M60.8125,55 M60.8125,56 M59.8125,56 M59.8125,57 M59.8125,58 M58.8125,58 M58.8125,59 M58.8125,60 M57.8125,60 M57.8125,61 M57.8125,62 M57.8125,63 M56.8125,63 M56.8125,64 M56.8125,65 M56.8125,66 M55.8125,66 M55.8125,67 M54.8125,67 M54.8125,68 M53.8125,68 M53.8125,69 M53.8125,70 M52.8125,70 M51.8125,70 M50.8125,70 M50.8125,71 M49.8125,71 M48.8125,71 M47.8125,71 M46.8125,71 M45.8125,71 M44.8125,71 M43.8125,71 M42.8125,71 M41.8125,71 M40.8125,71 M39.8125,71 M38.8125,71 M37.8125,71 M36.8125,71 M35.8125,71 M34.8125,71 M33.8125,71 M32.8125,71 M31.8125,71 M30.8125,71 M29.8125,71 M28.8125,71 M27.8125,71 M27.8125,70 M26.8125,70 M25.8125,70 M24.8125,70 M23.8125,70 M22.8125,70 M22.8125,69 M21.8125,69 M20.8125,69 M20.8125,68 M20.8125,67 M20.8125,66 M20.8125,65 M20.8125,64 M20.8125,63 M20.8125,62 M20.8125,61 M20.8125,60");
    }

    handleCheckboxChange = (checked:boolean) => {
        this.checked = checked;
    }
}

export const listaBonus:BonusConectado[] = [];

class ValorDeSistemaa {
    public id:number;
    public idRefBuff:number;
    public nome:string;
    public valor:number;

    constructor(id:number, idRefBuff:number, nome:string, valor:number) {
        this.id = id;
        this.idRefBuff = idRefBuff;
        this.nome = nome;
        this.valor = valor;
    }

    get bonus():number {
        return listaBonus.filter(bonus => bonus.id === this.idRefBuff).reduce((acc, cur) => {
            return (cur.checked ? acc + cur.valor : acc);
        }, 0);
    }

    get valorTotal():number {
        return this.valor + this.bonus;
    }
}




export class CharacterDetalhes {
    public nome:string;
    public classe:string;
    public nex:number;

    constructor(nome:string, classe:string, nex:number) {
        this.nome = nome;
        this.classe = classe;
        this.nex = nex;
    }
}



// class ValorBuffavel {
//     public id:number;
//     public descricao:string;

//     constructor(id:number, descricao:string) {
//         this.id = id;
//         this.descricao = descricao;
//     }
// }

// export const valorBuffavel:ValorBuffavel[] = [
//     new ValorBuffavel(1, "Agilidade"),
//     new ValorBuffavel(2, "Força"),
//     new ValorBuffavel(3, "Inteligência"),
//     new ValorBuffavel(4, "Presença"),
//     new ValorBuffavel(5, "Vigor"),
//     new ValorBuffavel(6, "Acrobacia"),
//     new ValorBuffavel(7, "Adestramento"),
//     new ValorBuffavel(8, "Artes"),
//     new ValorBuffavel(9, "Atletismo"),
//     new ValorBuffavel(10, "Atualidades"),
//     new ValorBuffavel(11, "Ciências"),
//     new ValorBuffavel(12, "Crime"),
//     new ValorBuffavel(13, "Diplomacia"),
//     new ValorBuffavel(14, "Enganação"),
//     new ValorBuffavel(15, "Engenharia"),
//     new ValorBuffavel(16, "Fortitude"),
//     new ValorBuffavel(17, "Furtividade"),
//     new ValorBuffavel(18, "Iniciativa"),
//     new ValorBuffavel(19, "Intimidação"),
//     new ValorBuffavel(20, "Intuição"),
//     new ValorBuffavel(21, "Investigação"),
//     new ValorBuffavel(22, "Luta"),
//     new ValorBuffavel(23, "Medicina"),
//     new ValorBuffavel(24, "Ocultista"),
//     new ValorBuffavel(25, "Percepção"),
//     new ValorBuffavel(26, "Pontaria"),
//     new ValorBuffavel(27, "Reflexo"),
//     new ValorBuffavel(28, "Sobrevivência"),
//     new ValorBuffavel(29, "Tatica"),
//     new ValorBuffavel(30, "Tecnologia"),
//     new ValorBuffavel(31, "Vontade"),
// ];
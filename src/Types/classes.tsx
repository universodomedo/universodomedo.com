import CheckboxComponent from "Components/SubComponents/CheckBoxValue/page.tsx";

export class BonusConectado {
    public id:number;
    public valor:number;
    public descricao:string;
    public valorBuffavel:string;
    public checked:boolean;
    public componente:React.FC<{ onChange: (checked: boolean) => void; checked: boolean }>;

    constructor(id:number, descricao:string, valorBuffavel:string, valor:number) {
        this.id = id;
        this.valor = valor;
        this.descricao = descricao;
        this.valorBuffavel = valorBuffavel;
        this.checked = false;
        this.componente = ({ onChange, checked }) => (
            <CheckboxComponent valor={this.valor} descricao={this.descricao} valorBuffavel={this.valorBuffavel} onChange={onChange} checked={checked} />
        )
    }

    handleCheckboxChange = (checked:boolean) => {
        this.checked = checked;
    }
}

export const listaBonus:BonusConectado[] = [];

class ValorDeSistema {
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

export class Estatistica {
    public nomeDisplay:string;
    public valorMaximo:number;
    public valorAtual:number;
    public valorTemp:number;

    constructor(nomeDisplay:string, valorMaximo:number, valorAtual:number, valorTemp:number) {
        this.nomeDisplay = nomeDisplay;
        this.valorMaximo = valorMaximo;
        this.valorAtual = valorAtual;
        this.valorTemp = valorTemp;
    }
}

export class Pericia extends ValorDeSistema {
    public parentAtributo: Atributo;

    constructor(id:number, idRefBuff:number, nome:string, valor:number, parentAtributo: Atributo) {
        super(id, idRefBuff, nome, valor);
        this.parentAtributo = parentAtributo;
    }
}

export class Atributo extends ValorDeSistema {
    public pericias:Pericia[] = [];

    constructor(id:number, idRefBuff:number, nome:string, valor:number) {
        super(id, idRefBuff, nome, valor);
    }

    addPericia = (pericia:Pericia) => {
        this.pericias.push(pericia);
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

export class Character {
    public estatisticas:Estatistica[];
    public atributos:Atributo[];
    public detalhes:CharacterDetalhes;

    constructor(estatisticas:Estatistica[], atributos:Atributo[], detalhes:CharacterDetalhes) {
        this.estatisticas = estatisticas;
        this.atributos = atributos;
        this.detalhes = detalhes;
    }
}

class ValorBuffavel {
    public id:number;
    public descricao:string;

    constructor(id:number, descricao:string) {
        this.id = id;
        this.descricao = descricao;
    }
}

export const valorBuffavel:ValorBuffavel[] = [
    new ValorBuffavel(1, "Agilidade"),
    new ValorBuffavel(2, "Força"),
    new ValorBuffavel(3, "Inteligência"),
    new ValorBuffavel(4, "Presença"),
    new ValorBuffavel(5, "Vigor"),
    new ValorBuffavel(6, "Acrobacia"),
    new ValorBuffavel(7, "Adestramento"),
    new ValorBuffavel(8, "Artes"),
    new ValorBuffavel(9, "Atletismo"),
    new ValorBuffavel(10, "Atualidades"),
    new ValorBuffavel(11, "Ciências"),
    new ValorBuffavel(12, "Crime"),
    new ValorBuffavel(13, "Diplomacia"),
    new ValorBuffavel(14, "Enganação"),
    new ValorBuffavel(15, "Engenharia"),
    new ValorBuffavel(16, "Fortitude"),
    new ValorBuffavel(17, "Furtividade"),
    new ValorBuffavel(18, "Iniciativa"),
    new ValorBuffavel(19, "Intimidação"),
    new ValorBuffavel(20, "Intuição"),
    new ValorBuffavel(21, "Investigação"),
    new ValorBuffavel(22, "Luta"),
    new ValorBuffavel(23, "Medicina"),
    new ValorBuffavel(24, "Ocultista"),
    new ValorBuffavel(25, "Percepção"),
    new ValorBuffavel(26, "Pontaria"),
    new ValorBuffavel(27, "Reflexo"),
    new ValorBuffavel(28, "Sobrevivência"),
    new ValorBuffavel(29, "Tatica"),
    new ValorBuffavel(30, "Tecnologia"),
    new ValorBuffavel(31, "Vontade"),
];
import CheckboxComponent from "./customComponent.tsx";

export class BonusConectado {
    public valor: number;
    public checked: boolean;
    public componente: React.FC<{ onChange: (checked: boolean) => void; checked: boolean }>;

    constructor(valor:number) {
        this.valor = valor;
        this.checked = false;
        this.componente = ({ onChange, checked }) => (
            <CheckboxComponent onChange={onChange} checked={checked} />
        )
    }

    handleCheckboxChange = (checked:boolean) => {
        this.checked = checked;
    }
}

class ValorDeSistema {
    public nome:string;
    public valor:number;
    public bonusConectado: BonusConectado[] = [];

    constructor(nome:string, valor:number) {
        this.nome = nome;
        this.valor = valor;
    }

    get bonus():number {
        return this.bonusConectado.reduce((accumulator, current) => {
            return (current.checked ? accumulator + current.valor : accumulator);
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

    constructor(nome:string, valor:number, parentAtributo: Atributo) {
        super(nome, valor);
        this.parentAtributo = parentAtributo;
    }
}

export class Atributo extends ValorDeSistema {
    public color:string;
    public pericias:Pericia[] = [];

    constructor(nome:string, valor:number, color:string) {
        super(nome, valor);
        this.color = color;
    }

    addPericia = (nome:string, valorPatente:number,) => {
        this.pericias.push(new Pericia(nome, valorPatente, this));
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
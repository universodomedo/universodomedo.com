// #region Imports
// #endregion

export class Personagem {
    public detalhes: PersonagemDetalhes;
    public estatisticasDanificaveis: EstatisticaDanificavel[] = [];

    constructor() {
        this.detalhes = new PersonagemDetalhes('Nome', 'Classe', 0);

        this.estatisticasDanificaveis = [
            new EstatisticaDanificavel(1, 9, 9),
            new EstatisticaDanificavel(2, 7, 7),
            new EstatisticaDanificavel(3, 2, 2),
        ];

        console.log(this);
    }

    exportar(): string {
        return btoa(JSON.stringify(this));
    }

    static importar(data: string): Personagem {
        // Decodifica a string Base64
        const decodedJson = atob(data);
    
        // Parseia a string para um objeto JavaScript
        const jsonData = JSON.parse(decodedJson);
    
        // Função recursiva para recriar instâncias de classe dinamicamente
        function reviveClasses(obj: any): any {
            if (obj === null || typeof obj !== 'object') {
                return obj; // Se não for objeto, retorna o valor (caso de tipos primitivos)
            }
    
            // Verifica se o objeto possui um protótipo diferente de Object (é uma instância de classe)
            const proto = Object.getPrototypeOf(obj);
            if (proto && proto !== Object.prototype) {
                const instance = Object.create(proto);
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // Recria as propriedades recursivamente
                        instance[key] = reviveClasses(obj[key]);
                    }
                }
                return instance;
            }
    
            // Se for um objeto comum ou array, aplica a recriação recursiva
            if (Array.isArray(obj)) {
                return obj.map(item => reviveClasses(item));
            }
    
            const newObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = reviveClasses(obj[key]);
                }
            }
    
            return newObj;
        }
    
        // Cria a instância de Personagem sem usar o construtor
        const personagem = Object.create(Personagem.prototype);
    
        // Atribui as propriedades dinamicamente e revive as classes
        Object.assign(personagem, reviveClasses(jsonData));
    
        return personagem;
    }
}

export class PersonagemDetalhes {
    constructor (
        public nome: string,
        public classe: string,
        public nex: number,
    ) {}
}

export class EstatisticaDanificavel {
    constructor(
        private _idEstatisticaDanificavel: number,
        public valor: number,
        public valorMaximo: number
    ) { }

    public aplicarDanoFinal(valor: number): void {
        this.valor = Math.max(this.valor - valor, 0);
    }
    public aplicarCura(valor: number): void {
        this.valor = Math.min(this.valor + valor, this.valorMaximo);
    }

    public alterarValorMaximo(valorMaximo: number): void {
        this.valorMaximo = this.valor = valorMaximo;
    }
}
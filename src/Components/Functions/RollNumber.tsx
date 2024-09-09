import { getRandomVariance, VariacaoAleatoria } from "udm-dice";

export function RollNumber(variancia:number) {
    const rnd = getRandomVariance(variancia);
    // console.log(`você foi prejudicado em ${rnd.variancia}`);
    return rnd;
    // Teste de Pericia -> Roda os valores, pega o maior, soma bonus
    // Aplicações -> Roda os valores, soma os valoes
}

export function TestePericia(valorAtributo:number, bonus:number) {
    const variancia = 19;

    const listaTestes:VariacaoAleatoria[] = [];

    for (let index = 0; index < valorAtributo; index++) {
        listaTestes.push(RollNumber(variancia))
    }

    const resultado:ResultadoTestePericia = new ResultadoTestePericia(listaTestes);

    return (20 - resultado.resultado.valorResultado) + bonus;
}

class ResultadoTestePericia {
    public testes:VariacaoAleatoria[] = [];

    constructor(testes:VariacaoAleatoria[]) {
        this.testes = testes;
        
        this.testes.forEach(teste => {
            // console.log(`Chance de penalizado em ${teste.variancia}: ${teste.chanceDessaVariancia}`);
        });
    }

    get resultado(): Resultado {
        const melhorTeste = this.testes.reduce((lowest, current) => {return current.variancia < lowest.variancia ? current : lowest}, this.testes[0]);

        return {
            valorResultado: melhorTeste.variancia,
            chanceDesseValor: melhorTeste.chanceDessaVariancia,
            sucessoDesseValorNoTeste: melhorTeste.sucessoDessaVariancia
        }
    }
}

type Resultado = {
    valorResultado: number;
    chanceDesseValor: number;
    sucessoDesseValorNoTeste: number;
}
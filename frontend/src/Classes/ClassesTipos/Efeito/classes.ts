import { SingletonHelper } from "Classes/classes_estaticas";
import { criarValoresEfeito, DadosValorEfeito, ValoresEfeito } from "Classes/ClassesTipos/index.ts";

export type LinhaEfeitoModelo = {
    id: number;
    nome: string;

    // vou deixar aqui, mas futuramente vai vim do banco de dados cada svg de cada linha de efeito
    // readonly svg: `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+`;
};

export type LinhaEfeito = LinhaEfeitoModelo;

export type TipoEfeitoModelo = {
    id: number;
    nome: string;
    nomeExibirTooltip: string;
};

export type TipoEfeito = TipoEfeitoModelo;

export type Efeito = {
    valoresEfeitos: ValoresEfeito;
    readonly refLinhaEfeito: LinhaEfeito;
    readonly refTipoEfeito: TipoEfeito;
    __key: "criarEfeito";
};

export type DadosEfeito = {
    dadosValorEfeito: DadosValorEfeito;
    idLinhaEfeito: number;
    idTipoEfeito: number;
};

export const criarEfeito = (dadosEfeito: DadosEfeito): Efeito => {
    return {
        valoresEfeitos: criarValoresEfeito(dadosEfeito.dadosValorEfeito),
        get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === dadosEfeito.idLinhaEfeito)!; },
        get refTipoEfeito(): TipoEfeito { return SingletonHelper.getInstance().tipos_efeito.find(tipo_efeito => tipo_efeito.id === dadosEfeito.idTipoEfeito)!; },
        __key: "criarEfeito", // Efeito não deve ser criado se não usando esse metodo
    }
};
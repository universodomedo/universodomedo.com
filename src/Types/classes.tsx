import CheckboxComponent from "Components/SubComponents/CheckBoxValue/page.tsx";
import { MDL_Atributo, MDL_AtributoPersonagem, MDL_EstatisticaDanificavel, MDL_PatentePericia, MDL_Pericia, MDL_Personagem, MDL_TipoDano, RLJ_AtributoPersonagem_Atributo, RLJ_EstatisticasDanificaveisPersonagem_Estatistica, RLJ_Ficha, RLJ_PericiasPatentesPersonagem_Pericia_Patente, RLJ_ReducaoDanoPersonagem_TipoDano, MDL_CaracteristicaArma, MDL_Habilidade, MDL_Ritual, RLJ_Rituais, MDL_CirculoRitual} from "udm-types";
import { TestePericia } from "Components/Functions/RollNumber.tsx";

export class Personagem {
    private _ficha!:RLJ_Ficha;
    public reducoesDano:ReducaoDano[];
    public atributos:Atributo[];
    public pericias:Pericia[];
    public buffs:Buff[] = [];
    public inventario:Item[];
    public acoes:Acao[] = [];
    // public habilidades:MDL_Habilidade[] = [];
    public rituais:Ritual[] = [];
    // public estatisticas:Estatisticas;
    public detalhes:CharacterDetalhes;
    public controladorPersonagem:ControladorPersonagem;

    //
    public onUpdate: () => void = () => {};
    carregaOnUpdate = (callback: () => void) => {
        this.onUpdate = callback;
    }
    //

    constructor(db_ficha?:RLJ_Ficha);

    // constructor(estatisticas:Estatisticas, atributos:Atributo[], detalhes:CharacterDetalhes, reducoesDano:ReducaoDano[], estatisticasDanificaveisPersonagem:EstatisticasDanificaveisPersonagem) {
    // constructor(db_ficha:RLJ_Ficha, habilidades: MDL_Habilidade[]) {
    constructor(db_ficha?:RLJ_Ficha) {
        if (db_ficha !== undefined && db_ficha !== null) {
            this._ficha = db_ficha;
        } else {
            this._ficha = {
                id: 0,
                idJogador: 0,
                dataCriacao: new Date(),
                detalhe: {
                    idPersonagem: 0,
                    idNivel: 1,
                    idClasse: 1,
                    nome: "Demonstração",
                    sufixoFugi: "",
                    caminhoPortrait: "",
                    nivel: {
                        id: 1,
                        nivel: 1,
                        nex: 0,
                    },
                    classe: {
                        id: 1,
                        nome: "Mundano",
                    },
                },
                atributos: [
                    {
                        idPersonagem: 1,
                        idAtributo: 1,
                        valor: 2,
                        atributo: {
                            id: 1,
                            idBuff: 1,
                            nome: "Agilidade",
                            nomeAbrev: "AGI"
                        },
                    },
                    {
                        idPersonagem: 1,
                        idAtributo: 2,
                        valor: 1,
                        atributo: {
                            id: 2,
                            idBuff: 2,
                            nome: "Força",
                            nomeAbrev: "FOR"
                        },
                    },
                    {
                        idPersonagem: 1,
                        idAtributo: 3,
                        valor: 2,
                        atributo: {
                            id: 3,
                            idBuff: 3,
                            nome: "Inteligência",
                            nomeAbrev: "INT"
                        },
                    },
                    {
                        idPersonagem: 1,
                        idAtributo: 4,
                        valor: 1,
                        atributo: {
                            id: 4,
                            idBuff: 4,
                            nome: "Presença",
                            nomeAbrev: "PRE"
                        },
                    },
                    {
                        idPersonagem: 1,
                        idAtributo: 5,
                        valor: 1,
                        atributo: {
                            id: 5,
                            idBuff: 5,
                            nome: "Vigor",
                            nomeAbrev: "VIG"
                        },
                    },
                ],
                periciasPatentes: [
                    {
                        idPersonagem: 1,
                        idPericia: 1,
                        idPatente: 1,
                        pericia: {
                            id: 1,
                            idAtributo: 1,
                            idBuff: 6,
                            nome: "Acrobacia",
                            nomeAbrev: "ACRO",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 2,
                        idPatente: 1,
                        pericia: {
                            id: 2,
                            idAtributo: 1,
                            idBuff: 12,
                            nome: "Crime",
                            nomeAbrev: "CRIM",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 3,
                        idPatente: 1,
                        pericia: {
                            id: 3,
                            idAtributo: 1,
                            idBuff: 17,
                            nome: "Furtividade",
                            nomeAbrev: "FURT",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 4,
                        idPatente: 1,
                        pericia: {
                            id: 4,
                            idAtributo: 1,
                            idBuff: 18,
                            nome: "Iniciativa",
                            nomeAbrev: "INIC",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 5,
                        idPatente: 1,
                        pericia: {
                            id: 5,
                            idAtributo: 1,
                            idBuff: 26,
                            nome: "Pontaria",
                            nomeAbrev: "PONT",
                        },
                        patente: {
                            id: 2,
                            nome: "Treinado",
                            valor: 5,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 6,
                        idPatente: 1,
                        pericia: {
                            id: 6,
                            idAtributo: 1,
                            idBuff: 27,
                            nome: "Reflexo",
                            nomeAbrev: "REFL",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 7,
                        idPatente: 1,
                        pericia: {
                            id: 7,
                            idAtributo: 2,
                            idBuff: 9,
                            nome: "Atletismo",
                            nomeAbrev: "ATLE",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 8,
                        idPatente: 1,
                        pericia: {
                            id: 8,
                            idAtributo: 2,
                            idBuff: 22,
                            nome: "Luta",
                            nomeAbrev: "LUTA",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 9,
                        idPatente: 1,
                        pericia: {
                            id: 9,
                            idAtributo: 3,
                            idBuff: 7,
                            nome: "Adestramento",
                            nomeAbrev: "ADES",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 10,
                        idPatente: 1,
                        pericia: {
                            id: 10,
                            idAtributo: 3,
                            idBuff: 8,
                            nome: "Artes",
                            nomeAbrev: "ARTE",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 11,
                        idPatente: 1,
                        pericia: {
                            id: 11,
                            idAtributo: 3,
                            idBuff: 10,
                            nome: "Atualidades",
                            nomeAbrev: "ATUA",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 12,
                        idPatente: 1,
                        pericia: {
                            id: 12,
                            idAtributo: 3,
                            idBuff: 11,
                            nome: "Ciências",
                            nomeAbrev: "CIEN",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 13,
                        idPatente: 1,
                        pericia: {
                            id: 13,
                            idAtributo: 3,
                            idBuff: 15,
                            nome: "Engenharia",
                            nomeAbrev: "ENGE",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 14,
                        idPatente: 1,
                        pericia: {
                            id: 14,
                            idAtributo: 3,
                            idBuff: 21,
                            nome: "Investigação",
                            nomeAbrev: "INVE",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 15,
                        idPatente: 1,
                        pericia: {
                            id: 15,
                            idAtributo: 3,
                            idBuff: 23,
                            nome: "Medicina",
                            nomeAbrev: "MEDI",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 16,
                        idPatente: 1,
                        pericia: {
                            id: 16,
                            idAtributo: 3,
                            idBuff: 24,
                            nome: "Ocultista",
                            nomeAbrev: "OCUL",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 17,
                        idPatente: 1,
                        pericia: {
                            id: 17,
                            idAtributo: 3,
                            idBuff: 28,
                            nome: "Sobrevivência",
                            nomeAbrev: "SOBR",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 18,
                        idPatente: 1,
                        pericia: {
                            id: 18,
                            idAtributo: 3,
                            idBuff: 29,
                            nome: "Tatica",
                            nomeAbrev: "TATI",
                        },
                        patente: {
                            id: 2,
                            nome: "Treinado",
                            valor: 5,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 19,
                        idPatente: 1,
                        pericia: {
                            id: 19,
                            idAtributo: 3,
                            idBuff: 30,
                            nome: "Tecnologia",
                            nomeAbrev: "TECN",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 20,
                        idPatente: 1,
                        pericia: {
                            id: 20,
                            idAtributo: 4,
                            idBuff: 13,
                            nome: "Diplomacia",
                            nomeAbrev: "DIPL",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 21,
                        idPatente: 1,
                        pericia: {
                            id: 21,
                            idAtributo: 4,
                            idBuff: 14,
                            nome: "Enganação",
                            nomeAbrev: "ENGA",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 22,
                        idPatente: 1,
                        pericia: {
                            id: 22,
                            idAtributo: 4,
                            idBuff: 19,
                            nome: "Intimidação",
                            nomeAbrev: "INTI",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 23,
                        idPatente: 1,
                        pericia: {
                            id: 23,
                            idAtributo: 4,
                            idBuff: 20,
                            nome: "Intuição",
                            nomeAbrev: "INTU",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 24,
                        idPatente: 1,
                        pericia: {
                            id: 24,
                            idAtributo: 4,
                            idBuff: 25,
                            nome: "Percepção",
                            nomeAbrev: "PERC",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 25,
                        idPatente: 1,
                        pericia: {
                            id: 25,
                            idAtributo: 4,
                            idBuff: 31,
                            nome: "Vontade",
                            nomeAbrev: "VONT",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    },
                    {
                        idPersonagem: 1,
                        idPericia: 26,
                        idPatente: 1,
                        pericia: {
                            id: 26,
                            idAtributo: 5,
                            idBuff: 16,
                            nome: "Fortitude",
                            nomeAbrev: "FORT",
                        },
                        patente: {
                            id: 1,
                            nome: "Destreinado",
                            valor: 0,
                        }
                    }
                ],
                estatisticasDanificaveis: [
                    {
                        idPersonagem: 1,
                        idEstatisticaDanificavel: 1,
                        valor: 9,
                        valorMaximo: 9,
                        estatisticaDanificavel: {
                            id: 1,
                            nome: "Pontos de Vida",
                            nomeAbrev: "P.V.",
                            cor: "#FF0000",
                        }
                    },
                    {
                        idPersonagem: 1,
                        idEstatisticaDanificavel: 2,
                        valor: 7,
                        valorMaximo: 7,
                        estatisticaDanificavel: {
                            id: 2,
                            nome: "Pontos de Sanidade",
                            nomeAbrev: "P.S.",
                            cor: "#324A99",
                        }
                    },
                    {
                        idPersonagem: 1,
                        idEstatisticaDanificavel: 3,
                        valor: 2,
                        valorMaximo: 2,
                        estatisticaDanificavel: {
                            id: 3,
                            nome: "Pontos de Esforço",
                            nomeAbrev: "P.E.",
                            cor: "#47BA16",
                        }
                    },
                ],
                reducoesDano: [
                    {
                        idPersonagem: 1,
                        idTipoDano: 1,
                        valor: 0,
                        tipoDano: {
                            id: 1,
                            idBuff: 32,
                            idTipoDanoPertencente: null,
                            idEstatisticaDanificavel: 1,
                            nome: "Vital"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 2,
                        valor: 0,
                        tipoDano: {
                            id: 2,
                            idBuff: 33,
                            idTipoDanoPertencente: 1,
                            idEstatisticaDanificavel: 1,
                            nome: "Mundano"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 3,
                        valor: 0,
                        tipoDano: {
                            id: 3,
                            idBuff: 34,
                            idTipoDanoPertencente: 2,
                            idEstatisticaDanificavel: 1,
                            nome: "Concussivo"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 4,
                        valor: 0,
                        tipoDano: {
                            id: 4,
                            idBuff: 35,
                            idTipoDanoPertencente: 2,
                            idEstatisticaDanificavel: 1,
                            nome: "Cortante"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 5,
                        valor: 0,
                        tipoDano: {
                            id: 5,
                            idBuff: 36,
                            idTipoDanoPertencente: 2,
                            idEstatisticaDanificavel: 1,
                            nome: "Perfurante"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 6,
                        valor: 0,
                        tipoDano: {
                            id: 6,
                            idBuff: 37,
                            idTipoDanoPertencente: 1,
                            idEstatisticaDanificavel: 1,
                            nome: "Natural"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 7,
                        valor: 0,
                        tipoDano: {
                            id: 7,
                            idBuff: 38,
                            idTipoDanoPertencente: 6,
                            idEstatisticaDanificavel: 1,
                            nome: "Elétrico"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 8,
                        valor: 0,
                        tipoDano: {
                            id: 8,
                            idBuff: 39,
                            idTipoDanoPertencente: 6,
                            idEstatisticaDanificavel: 1,
                            nome: "Fogo"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 9,
                        valor: 0,
                        tipoDano: {
                            id: 9,
                            idBuff: 40,
                            idTipoDanoPertencente: 6,
                            idEstatisticaDanificavel: 1,
                            nome: "Frio"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 10,
                        valor: 0,
                        tipoDano: {
                            id: 10,
                            idBuff: 41,
                            idTipoDanoPertencente: 6,
                            idEstatisticaDanificavel: 1,
                            nome: "Químico"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 11,
                        valor: 0,
                        tipoDano: {
                            id: 11,
                            idBuff: 42,
                            idTipoDanoPertencente: 1,
                            idEstatisticaDanificavel: 1,
                            nome: "Elemental"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 12,
                        valor: 0,
                        tipoDano: {
                            id: 12,
                            idBuff: 43,
                            idTipoDanoPertencente: 11,
                            idEstatisticaDanificavel: 1,
                            nome: "Conhecimento"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 13,
                        valor: 0,
                        tipoDano: {
                            id: 13,
                            idBuff: 44,
                            idTipoDanoPertencente: 11,
                            idEstatisticaDanificavel: 1,
                            nome: "Sangue"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 14,
                        valor: 0,
                        tipoDano: {
                            id: 14,
                            idBuff: 45,
                            idTipoDanoPertencente: 11,
                            idEstatisticaDanificavel: 1,
                            nome: "Energia"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 15,
                        valor: 0,
                        tipoDano: {
                            id: 15,
                            idBuff: 46,
                            idTipoDanoPertencente: 11,
                            idEstatisticaDanificavel: 1,
                            nome: "Morte"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 16,
                        valor: 0,
                        tipoDano: {
                            id: 16,
                            idBuff: 47,
                            idTipoDanoPertencente: 11,
                            idEstatisticaDanificavel: 1,
                            nome: "Medo"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 17,
                        valor: 0,
                        tipoDano: {
                            id: 17,
                            idBuff: 48,
                            idTipoDanoPertencente: null,
                            idEstatisticaDanificavel: 2,
                            nome: "Mental"
                        }
                    },
                    {
                        idPersonagem: 1,
                        idTipoDano: 18,
                        valor: 0,
                        tipoDano: {
                            id: 18,
                            idBuff: 49,
                            idTipoDanoPertencente: null,
                            idEstatisticaDanificavel: 3,
                            nome: "Debilitante"
                        }
                    }
                ],
                estatisticasBuffaveis: [],
                rituais: [],
            };
        }

        this.reducoesDano = this._ficha.reducoesDano.map(reducaoDano => new ReducaoDano(reducaoDano.valor!, reducaoDano.tipoDano, this));
        this.atributos = this._ficha.atributos.map(attr => new Atributo(attr.valor!, attr.atributo, this));
        this.pericias = this._ficha.periciasPatentes.map(periciaPatente => new Pericia(periciaPatente.pericia, periciaPatente.patente, this.atributos.find(atributo => atributo.atributo.id === periciaPatente.pericia.idAtributo)!, this));
        this.inventario = [new Item("Arma Corpo-a-Corpo Leve Simples", 2, 0)];
        // this.acoes = [new Acao("Teste", 4, this, new Buff(1, 2))];
        // this.habilidades = habilidades;
        this.rituais = [new Ritual("Aprimorar Acrobacia", "1° Círculo Fraco", "Energia", [])];
        this.buffs = [new Buff(6, 2)];
        // this.rituais = this._ficha.rituais.map(ritual => new Ritual(ritual.nome, `${ritual.circulo.tipoCirculo.numero}° ${ritual.circulo.nivel.nome}`, '',  [new Acao("Teste", 4, this, new Buff(1, 2))]));

        // this.estatisticas = estatisticas;
        this.detalhes = new CharacterDetalhes(this._ficha.detalhe.nome, this._ficha.detalhe.classe.nome, this._ficha.detalhe.nivel.nex!);

        const estatisticasDanificaveis = new EstatisticasDanificaveisPersonagem(
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 1)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor!, teste.valorMaximo!, teste.estatisticaDanificavel);
            })(),
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 2)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor!, teste.valorMaximo!, teste.estatisticaDanificavel);
            })(),
            (() => {
                const teste = this._ficha.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.idEstatisticaDanificavel === 3)!;
                return new EstatisticaDanificavel(teste.idEstatisticaDanificavel, teste.idPersonagem, teste.valor!, teste.valorMaximo!, teste.estatisticaDanificavel);
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
        private refAtributo:Atributo,
        private refPersonagem:Personagem
    ) {}
    
    get valorBonus():number {
        return this.refPersonagem.buffs.filter(buff => buff.idRefBuff === this.pericia.idBuff).reduce((acc, cur) => {
            return acc + cur.valor;
        }, 0);
    }

    get valorTotal():number {
        return this.patente.valor! + this.valorBonus;
    }

    realizarTeste = () => {
        return `Você realizou um Teste de ${this.pericia.nome}<br />${this.refAtributo.valorTotal} de ${this.refAtributo.atributo.nome} com ${this.valorTotal} de Bônus<br />O Resultado foi ${TestePericia(this.refAtributo.valorTotal, this.valorTotal)}`;
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

export class Acao {
    constructor(
        public nome:string,
        public id_efeito_acao:number,
        private personagem:Personagem,
        public buff?:Buff,
    ) {}

    executa = () => {
        if (this.id_efeito_acao === 4) {
            this.personagem.buffs.push(new Buff(this.buff!.idRefBuff, this.buff!.valor));
        }

        this.personagem.onUpdate();
    }
}

export class Ritual {
    constructor(
        public nome: string,
        public circulo: string,
        public elemento: string,
        public acoes:Acao[]
    ){}
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
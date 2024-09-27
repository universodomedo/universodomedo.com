// #region Imports
import CheckboxComponent from "Components/SubComponents/CheckBoxValue/page.tsx";
import { MDL_Atributo, MDL_AtributoPersonagem, MDL_EstatisticaDanificavel, MDL_PatentePericia, MDL_Pericia, MDL_Personagem, MDL_TipoDano, RLJ_AtributoPersonagem_Atributo, RLJ_EstatisticasDanificaveisPersonagem_Estatistica, RLJ_Ficha, RLJ_PericiasPatentesPersonagem_Pericia_Patente, RLJ_ReducaoDanoPersonagem_TipoDano, MDL_CaracteristicaArma, MDL_Habilidade, MDL_Ritual, RLJ_Rituais, MDL_CirculoRitual, MDL_EfeitoAcao, MDL_Duracao, MDL_Elemento } from "udm-types";
import { TestePericia } from "Components/Functions/RollNumber.tsx";
import { FichaHelper, SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class Historico {
    public lista:string[] = [];

    teste = (mensagem:string) => {
        this.lista.push(mensagem);
        console.log(mensagem);
    }
}

class Receptor {
    private historico:Historico = new Historico();

    constructor(
        public personagem:Personagem,
    ) {}

    teste = (idEstatistica:number, valorCura:number) => {
        this.personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === idEstatistica)?.aplicarCura(valorCura);
        this.historico.teste("Teste");

        this.personagem.onUpdate();
    }
}

export class Personagem {
    private _ficha!:RLJ_Ficha;
    public detalhes:CharacterDetalhes;
    public estatisticasDanificaveis:EstatisticaDanificavel[] = [];
    public estatisticasBuffaveis:EstatisticasBuffaveisPersonagem;
    public reducoesDano:ReducaoDano[];
    public atributos:AtributoPersonagem[];
    public pericias:PericiaPatentePersonagem[];
    public inventario:Inventario = new Inventario();
    public buffsExternos: Buff[] = [];
    // public habilidades:MDL_Habilidade[] = [];
    public rituais:Ritual[] = [];
    public receptor:Receptor = new Receptor(this);

    public get acoes(): Acao[] {
        const acoesRituais = this.rituais.reduce((acc: Acao[], ritual) => {
            return acc.concat(ritual.acoes);
        }, []);

        return acoesRituais.concat(this.inventario.acoesInventario());
    }

    public get buffs(): Buff[] {
        return this.obterBuffs().filter(buff => buff.ativo);
    }

    public get controladorBuffs(): ControladorBuff {
        return new ControladorBuff(
            [
                new BuffsPorId(6, [new BuffsPorTipo(1, [new BuffsAtivos(new Buff(6, 2, 1, 3, 1, this, 1), [new Buff(6, 1, 1, 3, 1, this, 1)])])])
            ]
        );
    }

    public get buffsAtivos(): { idBuff: number, buffPrincipal?: Buff, buffsSecundarios: Buff[] }[] {
        const buffsAtivos = this.buffs;

        const buffsMap: { [idBuff: number]: { buffPrincipal: Buff, buffsSecundarios: Buff[] } } = {};

        buffsAtivos.forEach(buff => {
            const idBuff = buff.refBuff.id;

            if (!buffsMap[idBuff]) {
                buffsMap[idBuff] = {
                    buffPrincipal: buff,
                    buffsSecundarios: []
                };
            } else {
                if (buff.valor > buffsMap[idBuff].buffPrincipal.valor) {
                    buffsMap[idBuff].buffsSecundarios.push(buffsMap[idBuff].buffPrincipal);
                    buffsMap[idBuff].buffPrincipal = buff;
                } else {
                    buffsMap[idBuff].buffsSecundarios.push(buff);
                }
            }
        });

        return Object.entries(buffsMap).map(([idBuff, { buffPrincipal, buffsSecundarios }]) => ({
            idBuff: Number(idBuff),
            buffPrincipal,
            buffsSecundarios
        }));
    }

    public onUpdate: () => void = () => {};

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
                        idPatente: 2,
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
                        idPatente: 2,
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

        this.detalhes = new CharacterDetalhes(this._ficha.detalhe.nome, this._ficha.detalhe.classe.nome, this._ficha.detalhe.nivel.nex!);

        this.estatisticasDanificaveis = this._ficha.estatisticasDanificaveis.map(estatisticaDanificavel => {
            return new EstatisticaDanificavel(estatisticaDanificavel.estatisticaDanificavel.id, estatisticaDanificavel.valor!, estatisticaDanificavel.valorMaximo!)
        });

        this.estatisticasBuffaveis = new EstatisticasBuffaveisPersonagem(
            new Defesa(5, 1, 1, 1),
            10,
            0,
            new NumeroAcoes(1, 1, 1),
            new EspacoInventario(5, 5),
            new EspacoCategoria(2, 0, 0, 0),
            [new Extremidade(), new Extremidade()],
        );

        this.reducoesDano = this._ficha.reducoesDano.map(reducaoDano => new ReducaoDano(reducaoDano.valor!, reducaoDano.tipoDano, this));
        this.atributos = this._ficha.atributos.map(attr => new AtributoPersonagem(attr.idAtributo, attr.valor!));
        this.pericias = this._ficha.periciasPatentes.map(periciaPatente => new PericiaPatentePersonagem(periciaPatente.idPericia, periciaPatente.idPatente));

        const item1 = new Item("Arma Corpo-a-Corpo Leve Simples", 2, 0, [], [], true);
        const listaAcaoItem1 = [ new Acao("Teste4", 4, 2, this, item1, []) ];
        item1.acoes = listaAcaoItem1;
        item1.adicionarBuff(new Buff(2, 1, 1, 3, 1, this, 1));
        this.inventario.adicionarItemNoInventario(item1);
        // this.habilidades = habilidades;

        const ritual1 = new Ritual("Aprimorar Acrobacia", 1, 2, []);
        const listaAcaoRitual1 = [new Acao("Usar Ritual Aprimorar Acrobacia", 3, 1, this, ritual1, [new Buff(6, 2, 1, 3, 1, this, 3)], new Custo(1, 2))];
        ritual1.acoes = listaAcaoRitual1;

        const ritual4 = new Ritual("Aprimorar Acrobacia2", 1, 2, []);
        const listaAcaoRitual4 = [new Acao("Usar Ritual Aprimorar Acrobacia2", 3, 1, this, ritual4, [new Buff(6, 1, 1, 3, 1, this, 3)], new Custo(1, 1))];
        ritual4.acoes = listaAcaoRitual4;

        const ritual2 = new Ritual("Aprimorar Investigação", 4, 1, []);
        const listaAcaoRitual2 = [new Acao("Usar Ritual Aprimorar Investigação", 3, 1, this, ritual2, [new Buff(21, 5, 1, 3, 1, this, 3)], new Custo(1, 7))];
        ritual2.acoes = listaAcaoRitual2;

        const ritual3 = new Ritual("Aprimorar Luta", 7, 5, []);
        const listaAcaoRitual3 = [new Acao("Usar Ritual Aprimorar Luta", 3, 1, this, ritual3, [new Buff(22, 9, 1, 3, 1, this, 3)], new Custo(1, 13))];
        ritual3.acoes = listaAcaoRitual3;
        this.rituais = [ritual1, ritual4, ritual2, ritual3];
    }

    // receberDanoVital = (danoGeral:DanoGeral) => {
    //     this.controladorPersonagem.reduzDano(danoGeral);
    // }

    public obterBuffs = (): Buff[] => {
        const buffsAcoes = this.acoes.reduce((acc: Buff[], acao) => {
            return acc.concat(acao.buffs);
        }, []);

        return buffsAcoes.concat(this.inventario.buffsInventario()).concat(this.buffsExternos); 
    }

    public rodaDuracao = (idDuracao: number) => {
        this.obterBuffs().filter(buff => buff.ativo).filter(buff => {
            if (buff.refDuracao.id === idDuracao) {
                buff.quantidadeDuracaoAtual--;
            }

            if (buff.quantidadeDuracaoAtual <= 0 || buff.refDuracao.id < idDuracao) {
                buff.desativaBuff();
            }
        });

        this.onUpdate();
    }

    public carregaOnUpdate = (callback: () => void) => {
        this.onUpdate = callback;
    }

    public adicionarNovoRitual = (nome:string, idElemento:number, idCirculo:number, idNivel:number) => {
        const circuloNivel = SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.idCirculo === idCirculo && circulo_nivel_ritual.idNivel === idNivel)!
        this.rituais = [...this.rituais, new Ritual(nome, circuloNivel.id, idElemento, [])];
        this.onUpdate();
    }
}

export class EstatisticasBuffaveisPersonagem {
    constructor(
        public defesa: Defesa,
        public deslocamento: number,
        public resistenciaParanormal: number,
        public numeroAcoes: NumeroAcoes,
        public espacoInventario: EspacoInventario,
        public espacoCategoria: EspacoCategoria,
        public extremidades: Extremidade[],
    ) {}
}

export class EspacoCategoria {
    constructor(
        categoria1:number,
        categoria2:number,
        categoria3:number,
        categoria4:number,
    ) {}
}

export class EspacoInventario {
    constructor(
        public valorNatural: number,
        public valorAdicionalPorForca: number,
    ) {}

    get espacoTotal():number {
        return (
            this.valorNatural +
            (this.valorAdicionalPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!)
        )
    }
}

export class Defesa {
    constructor(
        public valorNatural: number,
        public valorAdicionaPorAgilidade:number,
        public valorAdicionaPorForca:number,
        public valorAdicionaPorVigor:number,
    ) {}

    get defesaTotal():number {
        return (
            this.valorNatural +
            (this.valorAdicionaPorAgilidade * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) +
            (this.valorAdicionaPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) +
            (this.valorAdicionaPorVigor * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!)
        );
    }
}

export class NumeroAcoes {
    constructor(
        public padrao:number,
        public movimento:number,
        public reacao:number
    ) {}
}

export class EstatisticaBuffavel {
    constructor(
        public idEstatisticaBuffavel: number,
    ) {}
}

export class EstatisticaDanificavel {
    constructor(
        private idEstatisticaDanificavel: number,
        public valor: number,
        public valorMaximo: number
    ) {}

    get refEstatisticaDanificavel(): TipoEstatisticaDanificavel {
        return SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === this.idEstatisticaDanificavel)!;
    }

    public aplicarDanoFinal(valor: number): void {
        console.log(`Foram perdidos ${valor} pontos de ${this.refEstatisticaDanificavel.nomeAbrev}!`);
        this.valor = Math.max(this.valor - valor, 0);
    }
    public aplicarCura(valor: number): void {
        console.log(`Foram ganhos ${valor} pontos de ${this.refEstatisticaDanificavel.nomeAbrev}!`);
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
        return this.refPersonagem.buffs.filter(buff => buff.refBuff.id === this.tipoDano.idBuff).reduce((acc, cur) => {
            return acc + cur.valor;
        }, 0);
    }

    get valorTotal():number {
        return this.valor + this.valorBonus;
    }
}

export class Atributo {
    constructor(
        public id:number,
        private _idBuff:number,
        public nome:string,
        public nomeAbrev:string,
    ) {}

    get refBuffAtivo():Buff | {} {
        return FichaHelper.getInstance().personagem.buffsAtivos.find(buffAtivo => buffAtivo.idBuff === this._idBuff)?.buffPrincipal ?? {};
    }
}

export class AtributoPersonagem {
    constructor (
        private _idAtributo:number,
        public valor:number
    ) {}

    get refAtributo():Atributo {
        return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!;
    }

    get valorBonus():number {
        return this.refAtributo.refBuffAtivo instanceof Buff ? this.refAtributo.refBuffAtivo.valor : 0;
    }

    get valorTotal():number {
        return this.valor + this.valorBonus;
    }
}

export class Pericia {
    constructor(
        public id:number,
        private _idBuff:number,
        private _idAtributo:number,
        public nome:string,
        public nomeAbrev:string,
    ) {}

    get refBuffAtivo():Buff | {} {
        return FichaHelper.getInstance().personagem.buffsAtivos.find(buffAtivo => buffAtivo.idBuff === this._idBuff)?.buffPrincipal ?? {};
    }

    get refAtributo():Atributo {
        return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; 
    }
}

export class PatentePericia {
    constructor(
        public id:number,
        public nome:string,
        public valor:number,
    ) {}
}

export class PericiaPatentePersonagem {
    constructor(
        private _idPericia:number,
        private _idPatentePericia:number
    ) {}

    get refPericia():Pericia {
        return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!;
    }

    get refPatente():PatentePericia {
        return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this._idPatentePericia)!;
    }

    get refAtributoPersonagem():AtributoPersonagem {
        return FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === this.refPericia.refAtributo.id)!;
    }

    get valorBonus():number {
        return this.refPericia.refBuffAtivo instanceof Buff ? this.refPericia.refBuffAtivo.valor : 0;
    }

    get valorTotal():number {
        return this.refPatente.valor! + this.valorBonus;
    }

    realizarTeste = () => {
        return `Você realizou um Teste de ${this.refPericia.nome}<br />${this.refAtributoPersonagem.valorTotal} de ${this.refPericia.refAtributo.nome} com ${this.valorTotal} de Bônus<br />O Resultado foi ${TestePericia(this.refAtributoPersonagem.valorTotal, this.valorTotal)}`;
    }
}

export class Buff {
    public quantidadeDuracaoAtual: number = 0;
    public ativo: boolean = false;

    constructor (
        private idBuff: number,
        public valor: number,
        private idAcao: number,
        private idDuracao: number,
        public quantidadeDuracaoMaxima: number,
        private refPersonagem:Personagem,
        public idTipoBuff: number,
    ) {}

    get refBuff():BuffRef {
        return SingletonHelper.getInstance().buffs.find(buff => buff.id === this.idBuff)!;
    }

    get refAcao():Acao {
        return this.refPersonagem.acoes.find(acao => acao.id === this.idAcao)!;
    }

    get refDuracao():Duracao {
        return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === this.idDuracao)!;
    }

    get refTipoBuff():TipoBuff {
        return SingletonHelper.getInstance().tipos_buff.find(tipo_buff => tipo_buff.id === this.idTipoBuff)!;
    }

    ativaBuff = (): void => {
        this.ativo = true;
        this.quantidadeDuracaoAtual = this.quantidadeDuracaoMaxima;
    }

    desativaBuff = (): void => {
        this.ativo = false;
    }
}


// ================================================= //

export class Acao {
    private static nextId = 1;
    public id:number;

    constructor(
        public nome:string,
        private idTipoAcao:number,
        private idCategoriaAcao:number,
        private personagem:Personagem,
        public refPai: Ritual | Item,
        public buffs:Buff[],
        public custo?:Custo,
        public svg:string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
    ) {
        this.id = Acao.nextId++;

        if (this.refCategoriaAcao.id === 2) {
            this.buffs.map(buff => {
                this.personagem.buffs.push(buff);
            });
        }
    }

    get refTipoAcao():TipoAcao {
        return SingletonHelper.getInstance().tipos_acao.find(tipo_acao => tipo_acao.id === this.idTipoAcao)!;
    }

    get refCategoriaAcao():CategoriaAcao {
        return SingletonHelper.getInstance().categorias_acao.find(categoria_acao => categoria_acao.id === this.idCategoriaAcao)!;
    }

    get refTipoPai(): 'Ritual' | 'Item' | undefined {
        if (this.refPai instanceof Ritual) return "Ritual";
        if (this.refPai instanceof Item) return "Item";
    
        return undefined;
    }

    executa = () => {
        if (!this.verificaCustoPodeSerPagado) return;

        if (this.refTipoAcao.id === 3) {
            this.personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.aplicarDanoFinal(this.custo!.valor);

            this.buffs.map(buff => {buff.ativaBuff()});
        } else {
            console.log("Não Implementado");
        }

        this.personagem.onUpdate();
    }

    get verificaCustoPodeSerPagado():boolean {
        if (!this.custo) return true;
        
        return this.custo.valor <= this.personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valor;
    }

    get tooltipProps(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [this.nome],
                corpo: [`${this.refTipoPai!} - ${this.refPai.nome}`, this.refTipoAcao.nome]
            },
            iconeCustomizado: {
                corDeFundo: (this.verificaCustoPodeSerPagado ? '#FFFFFF' : '#BB0000'),
                svg: this.svg,
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
        }
    }

    static get filtroProps():FiltroProps<Acao> {
        return new FiltroProps<Acao>(
            "Ações",
            [
                new FiltroPropsItems<Acao>(
                    (acao) => acao.nome,
                    'Nome da Ação',
                    'Procure pela Ação',
                    'text',
                    true
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoAcao.id,
                    'Tipo de Ação',
                    'Selecione o Tipo de Ação',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().tipos_acao.map(tipo_acao => ({ id: tipo_acao.id, nome: tipo_acao.nome })))
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refPai.nome,
                    'Fonte da Ação',
                    'Selecione a Fonte da Ação',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: "Rituais", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.rituais.map(ritual => ({ id: ritual.nome, nome: ritual.nome}) )) },
                            { categoria: "Items", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.inventario.items.map(item => ({ id: item.nome, nome: item.nome} ))) }
                        ]
                    )
                ),
            ],
        );
    }
}

export class Ritual {
    private static nextId = 1;
    public id:number;

    constructor(
        public nome: string,
        private idCirculoNivel: number,
        public idElemento: number,
        public acoes:Acao[],
        public svg:string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+',
    ){
        this.id = Ritual.nextId++;
    }

    get refElemento():Elemento {
        return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this.idElemento)!;
    }
    
    get refCirculoNivelRitual():CirculoNivelRitual {
        return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === this.idCirculoNivel)!;
    }

    get tooltipProps(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [this.nome],
                corpo: [`Ritual de ${this.refElemento.nome}`, this.refCirculoNivelRitual.nome]
            },
            iconeCustomizado: {
                corDeFundo: this.refElemento.cores.corPrimaria,
                svg: this.svg
            },
            corTooltip: new CorTooltip(this.refElemento.cores.corPrimaria, this.refElemento.cores.corSecundaria, this.refElemento.cores.corTerciaria).cores
        }
    }

    static get filtroProps():FiltroProps<Ritual> {
        return new FiltroProps<Ritual>(
            "Rituais",
            [
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.nome,
                    'Nome do Ritual',
                    'Procure pelo Ritual',
                    'text',
                    true
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.refCirculoNivelRitual.id,
                    'Círculo',
                    'Selecione o Círculo do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().circulos_niveis_ritual.map(circulo_nivel => ({ id: circulo_nivel.id, nome: circulo_nivel.nome }))),
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.idElemento,
                    'Elemento',
                    'Selecione o Elemento do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
                ),
            ]
        )
    }
}

interface FilterOption {
    id: number;
    nome: string;
}

interface FilterConfig {
  filterableFields: string[];
  filterOptions: { [key: string]: FilterOption[] };
}

export class Elemento implements MDL_Elemento {
    constructor (
        public id: number,
        public nome: string,
        public cores: PaletaCores,
    ) {}
}

export class Circulo {
// export class Circulo implements MDL_CirculoRitual {
    constructor (
        public id: number,
        public nome: string,
    ) {}
}

// ================================================= //

export class ValorBuffavel {
    obterBonus = (idBuff:number):number => {
        return listaBonus.filter(bonus => bonus.id === idBuff).reduce((acc, cur) => {
            return (cur.checked ? acc + cur.valor : acc);
        }, 0);
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

// export class TipoDano {
//     public id:number;
//     public nome:string;
//     public danoPertencente?:TipoDano;
//     // estatistica alvo

//     constructor(id:number, nome:string) {
//         this.id = id;
//         this.nome = nome;
//     }
// }

export const listaTiposDano:MDL_TipoDano[] = [];

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

export class Custo {
    constructor(
        public idTipoCusto:number,
        public valor:number,
    ) {}
}

export class NivelRitual {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class CirculoRitual {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class CirculoNivelRitual {
    constructor(
        public id:number,
        public idCirculo:number,
        public idNivel:number,
    ) {}

    get nome():string {
        return `${SingletonHelper.getInstance().circulos_ritual.find(circulo_ritual => circulo_ritual.id === this.idCirculo)!.nome}º Círculo ${SingletonHelper.getInstance().niveis_ritual.find(nivel_ritual => nivel_ritual.id === this.idNivel)!.nome}`;
    }
}
export class BuffRef {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class Alcance {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class FormatoAlcance {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class Duracao {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class Execucao {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoAcao {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoAlvo {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoCusto {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoDano {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoBuff {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class CategoriaAcao {
    constructor(
        public id:number,
        public nome:string,
    ) {}
}
export class TipoEstatisticaDanificavel {
    constructor(
        public id:number,
        public nome:string,
        public nomeAbrev:string,
        public cor:string,
    ) {}
}
export class TipoEstatisticaBuffavel {
    constructor(
        public id:number,
        public nome:string
    ) {}
}
export class Inventario {
    public items:Item[] = [];

    constructor() {}

    get espacosUsados():number {
        return this.items.reduce((acc, cur) => {return acc + cur.peso}, 0)
    }

    public adicionarItemNoInventario = (item:Item): void => {        
        this.items.push(item);
    }

    public acoesInventario = (): Acao[] => {
        return this.items.reduce((acc: Acao[], item) => acc.concat(item.acoes) ,[]);
    }

    public buffsInventario = (): Buff[] => {
        const teste = this.items.reduce((acc: Buff[], item) => acc.concat(item.buffs), []);
        return teste;
    }
}

export class Item {
    private static nextId = 1;
    public id:number;

    private idExtremidade?: number;
    public refExtremidade?: Extremidade;

    constructor(
        public nome:string,
        public peso:number,
        public categoria:number,
        public acoes:Acao[],
        public buffs:Buff[],
        public precisaEstarEmpunhado:boolean,
    ) {
        this.id = Item.nextId++;

        if (!this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    adicionarBuff = (buff:Buff):void => {
        if (!this.precisaEstarEmpunhado) {
            buff.ativaBuff();
        }
        this.buffs.push(buff);
    }

    estaEmpunhado = ():boolean => {
        return !!this.idExtremidade;
    }

    sacar = (idExtremidade:number):void => {
        this.idExtremidade = idExtremidade;
        this.refExtremidade = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades[idExtremidade];

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            })
        }
    }

    guardar = ():void => {
        this.idExtremidade = undefined;
        this.refExtremidade = undefined;

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.desativaBuff();
            })
        }
    }
}

export class Extremidade {
    private static nextId = 1;
    public id:number;
    public idItemEmpunhado?:number;
    public bloqueado:boolean = false;
    public refItem?:Item;

    constructor() {
        this.id = Extremidade.nextId++;
    }

    empunhar = (idItem:number):void => {
        this.idItemEmpunhado = idItem;
        this.refItem = FichaHelper.getInstance().personagem.inventario.items[idItem];
        this.refItem.sacar(this.id);
        FichaHelper.getInstance().personagem.onUpdate();
    }

    desempunhar = ():void => {
        this.idItemEmpunhado = undefined;
        this.refItem = undefined;
    }
}

class BuffsAtivos {
    constructor(
        public buffPrincipal:Buff,
        public buffsSecundarios:Buff[],
    ) {}
}

class BuffsPorTipo {
    constructor(
        public idTipoBuff:number,
        public listaBuffs:BuffsAtivos[],
    ) {}

    get valorParaId():number {
        return this.listaBuffs.reduce((acc, cur) => {
            return acc + (cur.buffPrincipal? cur.buffPrincipal.valor : 0);
        }, 0);
    }
}

class BuffsPorId {
    constructor(
        public ifBuff:number,
        public tipoBuff:BuffsPorTipo[],
    ) {}

    get valorParaId():number {
        return this.tipoBuff.reduce((acc, cur) => {
            return acc + cur.valorParaId;
        }, 0)
    }
}

class ControladorBuff {
    constructor(
        public listaObjetosBuff:BuffsPorId[],
    ) {}

    public buffPorId = (idBuff:number):number => {
        const buff = this.listaObjetosBuff.find(objetoBuff => objetoBuff.ifBuff === idBuff);
        return buff ? buff.valorParaId : 0; 
    }
}

export class FiltroProps<T> {
    constructor(
        public titulo: string,
        public items: FiltroPropsItems<T>[]
    ) {}
}

type OpcaoFiltro = { id:number | string; nome: string; };
export type OpcaoFormatada = { value: string; label: string; };

type CategoriaFiltro = { categoria: string; opcoes: OpcoesFiltro; }[];
export type CategoriaFormatada = { label: string; options: OpcaoFormatada[]; };

class OpcoesFiltro {
    constructor(
        private _opcoes: OpcaoFiltro[]
    ) {}

    get opcoes(): OpcaoFormatada[] {
        return this._opcoes.reduce((acc, opcao) => {
            acc.push({ value: opcao.id.toString(), label: opcao.nome })

            return acc;
        }, [] as OpcaoFormatada[]);
    }
}

export class OpcoesFiltrosCategorizadas {
    constructor(
        private _categorias: CategoriaFiltro
    ) {}

    get categorias(): CategoriaFormatada[] {
        return this._categorias.reduce((acc, categoria) => {
            acc.push({ label: categoria.categoria, options: categoria.opcoes.opcoes });

            return acc;
        }, [] as CategoriaFormatada[]);
    }
}

export class FiltroPropsItems<T> {
    constructor(
        public key: keyof T | ((item: T) => any),
        public label: string,
        public placeholder: string,
        public filterType: 'text' | 'select' | 'number',
        public sortEnabled: boolean,
        private _options?: OpcoesFiltro | OpcoesFiltrosCategorizadas,
    ) {}
  
    temOpcoes(): boolean {
      return this._options !== undefined;
    }

    temCategorias(): boolean {
        return this._options instanceof OpcoesFiltrosCategorizadas;
    }

    get options() : OpcaoFormatada[] | CategoriaFormatada[] | undefined {
        if (this._options instanceof OpcoesFiltro) {
            return this._options.opcoes;
        }
        if (this._options instanceof OpcoesFiltrosCategorizadas) {
            return this._options.categorias;
        }
    }
}

export interface CaixaInformacaoProps {
    cabecalho: string[],
    corpo: string[],
}

export interface IconeCustomizadoProps {
    corDeFundo:string,
    svg:string
}

export class CorTooltip {
    constructor(
        private _corPrimaria:string,
        private _corSecundaria?:string,
        private _corTerciaria?:string,
    ) {}

    get cores():PaletaCores {
        return {
            corPrimaria: this._corPrimaria,
            corSecundaria: this._corSecundaria ? this._corSecundaria : this._corPrimaria,
            corTerciaria: this._corTerciaria ? this._corTerciaria: this._corPrimaria,
        }
    }
}

export interface TooltipProps {
    caixaInformacao: CaixaInformacaoProps,
    iconeCustomizado: IconeCustomizadoProps,
    corTooltip: PaletaCores,
}

export interface PaletaCores {
    corPrimaria: string,
    corSecundaria?: string,
    corTerciaria?: string
}

// reduzDano = (danoGeral:DanoGeral) => {
//     let dano:number = 0;
//     // danoGeral.listaDano.forEach(instanciaDano => {
//     //     const rd = this.rds.find(rd => rd.tipo.id === instanciaDano.tipoDano.id);
//     //     console.log(`Recebi ${instanciaDano.valor} de Dano ${instanciaDano.tipoDano.nome}, tendo ${rd!.valor} de RD`);
//     //     dano += instanciaDano.valor - rd!.valor;
//     // });

//     let somaDanoNivel1 = 0;
//     listaTiposDano.filter(tipoDano => !tipoDano.idTipoDanoPertencente).map(tipoDanoNivel1 => {
//         let somaDanoNivel2 = 0;
//         listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel1.id).map(tipoDanoNivel2 => {
//             let somaDanoNivel3 = 0;
//             listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel2.id).map(tipoDanoNivel3 => {
//                 const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel3.id);
//                 if (danoDoTipo) somaDanoNivel3 += Math.max(danoDoTipo.valor - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel3.id)!.valor, 0);
//             });
//             const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel2.id);
//             somaDanoNivel2 += Math.max((somaDanoNivel3 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel2.id)!.valor, 0);
//         });
//         const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel1.id);
//         somaDanoNivel1 += Math.max((somaDanoNivel2 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel1.id)!.valor, 0);
//     });

//     this.estatisticasDanificaveis.pv.aplicarDanoFinal(somaDanoNivel1);
// }
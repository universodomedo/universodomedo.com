'use client';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { useContextoEvoluindoPersonagem } from 'Contextos/ContextoEvoluindoPersonagem/contexto.tsx';

import ResumoInicial from 'Componentes/EdicaoFicha/paginas-etapas/resumo-inicial.tsx';
import ResumoFinal from 'Componentes/EdicaoFicha/paginas-etapas/resumo-final.tsx';
import SelecaoClasse from 'Componentes/EdicaoFicha/paginas-etapas/selecao-classe.tsx';
import InformativoAumentoMaximoAtributo from 'Componentes/EdicaoFicha/paginas-etapas/informativo-aumento-maximo-atributo.tsx';
import EdicaoEstatisticas from 'Componentes/EdicaoFicha/paginas-etapas/edicao-estatisticas.tsx';
import InformativoPontosHabilidadeEspecial from 'Componentes/EdicaoFicha/paginas-etapas/informativo-pontos-habilidade-especial.tsx';
import EdicaoAtributos from 'Componentes/EdicaoFicha/paginas-etapas/edicao-atributos.tsx';
import EdicaoPericias from 'Componentes/EdicaoFicha/paginas-etapas/edicao-pericias.tsx';
import InformativoPontosMelhoriaRitual from 'Componentes/EdicaoFicha/paginas-etapas/informativo-pontos-melhoria-ritual.tsx';
import EdicaoRituais from 'Componentes/EdicaoFicha/paginas-etapas/edicao-rituais.tsx';
import EdicaoHabilidadesParanormais from 'Componentes/EdicaoFicha/paginas-etapas/edicao-habilidades-paranormais.tsx';
import EdicaoHabilidadesElementais from 'Componentes/EdicaoFicha/paginas-etapas/edicao-habilidades-elementais.tsx';

import { obtemGanhosParaEvoluir } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AtributoDto, AtributoFichaDto, DadosGanho_Atributos, DadosGanho_Pericias, DetalheFichaDto, EstatisticaDanificavelFichaDto, FichaPersonagemDto, GanhoEstatisticaAtributoClasseDto, GanhoNivelClasseDto, PatentePericiaDto, PericiaDto, PericiaFichaDto, PersonagemDto } from 'types-nora-api';
import { pluralize } from 'Uteis/UteisTexto/pluralize';

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
import React from 'react';

export class GanhosEvolucao {
    public etapas: EtapaGanhoEvolucao[];
    public ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[];
    public estaAbertoResumoInicial: boolean;
    public estaAbertoResumoFinal: boolean;
    public indexEtapaEmAndamento: number = 0;

    constructor(
        public refPersonagem: PersonagemDto,
        dadosReferencia: { atributos: AtributoDto[], patentes: PatentePericiaDto[], pericias: PericiaDto[] },
        ganhosEmJson: GanhoNivelClasseDto[],
        ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[]
    ) {
        GanhosEvolucao.dadosReferencia = dadosReferencia;
        this.etapas = GanhosEvolucao.formataGanhos(ganhosEmJson, refPersonagem.fichaVigente!.detalhe);
        this.ganhosEstatisticasPorAtributo = ganhosEstatisticasPorAtributo;

        if (this.etapas.length > 0) {
            this.estaAbertoResumoInicial = true;
            this.estaAbertoResumoFinal = false;
        } else {
            this.estaAbertoResumoInicial = false;
            this.estaAbertoResumoFinal = true;
        }
    }

    // #region Logica de Etapa
    //
    get etapaAtual(): EtapaGanhoEvolucao { return this.etapas[this.indexEtapaEmAndamento]; }

    get estaNaPrimeiraPagina(): boolean { return this.etapas.length === 0 || this.estaAbertoResumoInicial; }
    get estaNaUltimaPagina(): boolean { return this.etapas.length === 0 || this.estaAbertoResumoFinal; }
    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapaEmAndamento === 0; }
    get estaNaUltimaEtapa(): boolean { return this.indexEtapaEmAndamento === (this.etapas.length - 1); }

    get estaEmPaginaDeResumo(): boolean { return this.estaAbertoResumoInicial || this.estaAbertoResumoFinal; }
    //
    // #endregion

    // #region Logica de Botões
    //
    get textoBotaoProximo(): string { return this.estaNaPrimeiraPagina ? 'Começar' : this.estaNaUltimaPagina ? 'Finalizar' : 'Continuar'; }
    get podeAvancarEtapa(): boolean { return this.estaEmPaginaDeResumo || (this.etapaAtual != null && this.etapaAtual.finalizado); }
    avancaEtapa = () => {
        if (this.estaAbertoResumoInicial)
            this.estaAbertoResumoInicial = false;
        else if (this.estaAbertoResumoFinal)
            // esse procedimento tem q ser feito no proprio Next para acessar a logica do backend para salvar
            return;
        else if (this.estaNaUltimaEtapa)
            this.estaAbertoResumoFinal = true;
        else
            this.indexEtapaEmAndamento++;
    }


    get textoBotaoAnterior(): string { return this.estaNaPrimeiraPagina ? 'Sair' : 'Voltar'; }
    get podeRetrocederEtapa(): boolean { return true; }
    retrocedeEtapa = () => {
        // esse procedimento tem q ser feito no proprio Next para resetar o contexto do personagem selecionado
        if (this.estaAbertoResumoInicial) return;

        if (this.estaAbertoResumoFinal)
            this.estaAbertoResumoFinal = false;
        else if (this.estaNaPrimeiraEtapa)
            this.estaAbertoResumoInicial = true;
        else
            this.indexEtapaEmAndamento--;
    }
    //
    // #endregion 

    get tituloNexUp(): string {
        if (this.refPersonagem.fichaPendente?.nivel.id === 1) return `${this.refPersonagem.informacao.nome} - Criando Ficha`;

        if (!(this.etapaAtual instanceof EtapaGanhoEvolucao_Atributos)) {
            // const ganhoClasse = this.etapa as GanhoIndividualNexEscolhaClasse;
            return `Selecionando Classe: necessario implementar variavel ganhoClasse`;
        }

        return `Evoluindo Ficha - ${this.refPersonagem.fichaPendente?.nivel.nomeVisualizacao}`;
    }

    // #region Elementos de Edição
    //
    get atributosEditados(): AtributoFichaDto[] {
        const etapaAtributos = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos);

        return this.refPersonagem.fichaVigente?.atributos.sort((a, b) => a.atributo.id - b.atributo.id).map(atributoFicha => ({
            ...atributoFicha,
            valor:
                atributoFicha.valor
                + (etapaAtributos?.pontosDeGanho.filter(registro => registro.atributo?.id === atributoFicha.atributo.id).length ?? 0)
                + (etapaAtributos?.pontosDeTroca.filter(troca => troca.atributoGanhou?.id === atributoFicha.atributo.id).length ?? 0)
                - (etapaAtributos?.pontosDeTroca.filter(troca => troca.atributoPerdeu?.id === atributoFicha.atributo.id).length ?? 0)
        })) ?? [];
    };

    // get periciasEditadas(): PericiaFichaDto[];
    // get estatisticasEditadas(): EstatisticaDanificavelFichaDto[];

    get estatisticasDanificaveisEmEdicao(): EstatisticasDanificaveisEmEdicao {
        return this.refPersonagem.fichaVigente?.estatisticasDanificaveis?.reduce((acc, estatisticaDanificavel) => {
            const idEstatistica = estatisticaDanificavel.estatisticaDanificavel.id;

            const totalGanho = (this.ganhosEstatisticasPorAtributo.filter(ganhoEstatistica => ganhoEstatistica.estatisticaDanificavel.id === idEstatistica) || []).reduce((acc, cur) => {
                return acc + (cur.valorPorUnidade * this.atributosEditados.find(atributo => atributo.atributo.id === cur.atributo.id)!.valor);
            }, 0);

            const totalGanhoArredondado = Math.ceil(totalGanho);

            acc[idEstatistica] = {
                valorAtual: estatisticaDanificavel.valorMaximo,
                ganhoDaEvolucao: totalGanhoArredondado,
                valorTotal: estatisticaDanificavel.valorMaximo + totalGanhoArredondado,
            };

            return acc;
        }, {} as EstatisticasDanificaveisEmEdicao) ?? {};
    };

    get periciasAgrupadasEEditadas(): { atributo: AtributoDto, periciasDesseAtributo: { pericia: PericiaDto, patenteAtualDaPericia: PatentePericiaDto }[] }[] {
        const etapaPericias = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias);

        return GanhosEvolucao.dadosReferencia.atributos.map(atributo => ({
            atributo,
            periciasDesseAtributo: (this.refPersonagem.fichaVigente?.pericias || []).filter(periciaFicha => periciaFicha.pericia.atributo.id === atributo.id).map(periciaFicha => {
                const idDaPatenteComEdicao = periciaFicha.patentePericia.id + (etapaPericias?.pontosDeGanho.filter(pontos => pontos.pericia?.id === periciaFicha.pericia.id).length ?? 0);
                const patenteAtual: PatentePericiaDto = GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === idDaPatenteComEdicao)!

                return {
                    pericia: periciaFicha.pericia,
                    patenteAtualDaPericia: patenteAtual,
                };
            }),
        }));
    }

    // get fichaEvoluida(): FichaPersonagemDto {
    //     return {
    //         // ...this.refPersonagem.fichaPendente,
    //         // atributos: this.atributosEditados,
    //         // estatisticasDanificaveis: this.refPersonagem.fichaVigente!.estatisticasDanificaveis,
    //     };
    // }

    get resumoEvolucaoProvisorio(): string {
        const resumo = {
            atributos: this.atributosEditados.filter(atributoEditado => atributoEditado.valor !== 1).map(atributoEditado => ({
                idAtributo: atributoEditado.atributo.id,
                valor: atributoEditado.valor,
            })),
            pericias: this.periciasAgrupadasEEditadas
                .map(atributo => ({
                    ...atributo,
                    periciasDesseAtributo: atributo.periciasDesseAtributo.filter(
                        periciaEditada => periciaEditada.patenteAtualDaPericia.id > 1
                    )
                }))
                .filter(atributo => atributo.periciasDesseAtributo.length > 0)
                .map(atributo => atributo.periciasDesseAtributo.map(periciaEditada => ({
                    idPericia: periciaEditada.pericia.id,
                    idPatente: periciaEditada.patenteAtualDaPericia.id,
                })))
        };

        return JSON.stringify(resumo);
    }
    //
    // #endregion

    // #region Propriedades Estaticas
    //
    static dadosReferencia: { atributos: AtributoDto[], patentes: PatentePericiaDto[], pericias: PericiaDto[] };

    static formataGanhos(ganhosEmJson: GanhoNivelClasseDto[], detalhesFicha: DetalheFichaDto): EtapaGanhoEvolucao[] {
        const retorno: EtapaGanhoEvolucao[] = [];

        ganhosEmJson.sort((a, b) => a.tipoGanhoNivel.ordem - b.tipoGanhoNivel.ordem).map(ganho => {
            switch (ganho.tipoGanhoNivel.id) {
                case 1:
                    // Alterações de Atributos
                    retorno.push(new EtapaGanhoEvolucao_Atributos((ganho.dados as DadosGanho_Atributos), detalhesFicha.dados.valorMaxAtributo));
                    break;
                case 2:
                    // Alterações de Perícias
                    const dadosPreparados = (ganho.dados as DadosGanho_Pericias[]).map(ganho => ({
                        ganho: ganho,
                        patente: GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === ganho.idPatente)!
                    }));

                    retorno.push(new EtapaGanhoEvolucao_Pericias(dadosPreparados));
                    break;
                case 3:
                    // Alterações de Estatísticas

                    break;
                case 4:
                    // Seleção de Classe

                    break;
                case 5:
                    // Aumento de Valor Máximo de Atributo

                    break;
                case 6:
                    // Ganho de Pontos de Habilidades Especial

                    break;
                case 7:
                    // Ganho de Pontos de Habilidades Paranormal

                    break;
                case 8:
                    // Alterações de Rituais

                    break;
                case 9:
                    // Ganho de Pontos de Melhoria de Ritual

                    break;
                case 10:
                    // Ganho de Pontos de Habilidade Elemental

                    break;
            }
        })

        return retorno;
    };
    //
    // #endregion
}

type RegistroDeUsoDeGanhoDeAtributo = { atributo: AtributoDto | null };
type RegistroDeUsoDeTrocaDeAtributo = { atributoPerdeu: AtributoDto | null, atributoGanhou: AtributoDto | null };
type RegistroDeUsoDeGanhoDeMelhoriaDePatente = { patente: PatentePericiaDto, pericia: PericiaDto | null; paramsLivre?: { patenteDepoisDaEvolucao: number } };
type RegistroDeUsoDeTrocaDeMelhoriaDePatente = { periciaPerdeu: PericiaDto | null, periciaGanhou: PericiaDto | null, patente: PatentePericiaDto };

abstract class EtapaGanhoEvolucao {
    public abstract tituloEtapa: string;
    public abstract get avisosGanhoEvolucao(): AvisoGanhoEvolucao[];
    public abstract get finalizado(): boolean;
}

export class EtapaGanhoEvolucao_Classes extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Classes';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_ValorMaxAtributo extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Valor Máximo de Atributo';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_Estatisticas extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Estatísticas';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_HabilidadesEspeciais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Habilidade Especial';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_Atributos extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Atributos';
    public pontosDeGanho: RegistroDeUsoDeGanhoDeAtributo[];
    public pontosDeTroca: RegistroDeUsoDeTrocaDeAtributo[];
    public valorMaxAtributo: number;
    public valorMinAtributo: number = 0;

    constructor(dadosGanho: DadosGanho_Atributos, valorMaxAtributo: number) {
        super();
        this.pontosDeGanho = Array.from({ length: dadosGanho.ganhos }, () => ({ atributo: null }));
        this.pontosDeTroca = Array.from({ length: dadosGanho.trocas }, () => ({ atributoPerdeu: null, atributoGanhou: null }));
        this.valorMaxAtributo = valorMaxAtributo;
    }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: `Valor de Atributo pode variar entre ${this.valorMinAtributo} e ${this.valorMaxAtributo}`, icone: '' },

            ...(
                this.obtemNumeroPontosGanho > 0
                    ? [
                        {
                            mensagem: `Ganho de ${this.obtemNumeroPontosGanho} ${pluralize(this.obtemNumeroPontosGanho, 'Atributo')} ${this.obtemNumeroPontosGanhoLivres > 0 ? `(${this.obtemNumeroPontosGanhoLivres} ${pluralize(this.obtemNumeroPontosGanhoLivres, 'Restante')})` : '(Concluído)'}`,
                            icone: (!this.temPontoGanhoLivre ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                        },
                        ...(
                            this.pontosDeGanho.map(registro => {
                                return registro.atributo
                                    ? {
                                        mensagem: `Aumento de ${registro.atributo.nome}`,
                                        icone: ``,
                                        tipo: 'subitem' as const,
                                    }
                                    : {
                                        mensagem: `Ganho Pendente`,
                                        icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                        tipo: 'subitem' as const,
                                    }
                            })
                        )
                    ]
                    : []
            ),

            ...(
                this.obtemNumeroPontosTroca > 0
                    ? [
                        {
                            mensagem: `Troca Opcional de ${this.obtemNumeroPontosTroca} ${pluralize(this.obtemNumeroPontosTroca, 'Atributo')} ${this.obtemNumeroPontosTrocaLivres > 0 ? `(${this.obtemNumeroPontosTrocaLivres} ${pluralize(this.obtemNumeroPontosTrocaLivres, 'Disponível', 'Disponíveis')})` : '(Usado)'}`,
                            icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                        },
                        ...(
                            this.pontosDeTroca.filter(atributo => atributo.atributoPerdeu).map(atributo => {
                                return atributo.atributoGanhou
                                    ? {
                                        mensagem: `Trocado 1 Ponto de ${atributo.atributoPerdeu?.nome} para ${atributo.atributoGanhou.nome}`,
                                        icone: ``,
                                        tipo: 'subitem' as const,
                                    }
                                    : {
                                        mensagem: `Trocando 1 Ponto de ${atributo.atributoPerdeu?.nome} (Pendente)`,
                                        icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                        tipo: 'subitem' as const,
                                    }
                            })
                        )
                    ]
                    : []
            ),
        ];
    };

    get finalizado(): boolean { return !this.temPontoGanhoLivre && this.obtemNumeroPontosTrocaEmAndamento === 0; }

    // #region Logica de Pontos de Ganho
    // / Simplesmente soma no valor do Atributo
    // / Obrigatório gastar todos os pontos recebidos
    //
    get obtemNumeroPontosGanho(): number { return this.pontosDeGanho.length; }
    get obtemNumeroPontosGanhoLivres(): number { return (this.pontosDeGanho.filter(registro => registro === null) || []).length; }
    get pontoGanhoLivre(): number { return this.pontosDeGanho.findIndex(registro => registro.atributo === null); }
    get temPontoGanhoLivre(): boolean { return this.pontoGanhoLivre >= 0; }
    //
    // #endregion

    // #region Logica de Pontos de Troca
    // / Permite a Troca de um Ponto de um Atributo para outro
    // / / Ainda são levadas as regras de Valor Mínimo e Valor Máximo de Atributo
    // / Opcional gastar todos os pontos
    // / / Quando retirado um Atributo, obrigatório fazer a troca
    //
    get obtemNumeroPontosTroca(): number { return this.pontosDeTroca.length; }
    get obtemNumeroPontosTrocaLivres(): number { return (this.pontosDeTroca.filter(registro => !registro.atributoPerdeu) || []).length; }
    get obtemNumeroPontosTrocaEmAndamento(): number { return (this.pontosDeTroca.filter(registro => registro.atributoPerdeu && !registro.atributoGanhou) || []).length; }

    get pontoTrocaRetiraLivre() { return this.pontosDeTroca.findIndex(registro => !registro.atributoPerdeu); }
    get pontoTrocaGanhaLivre() { return this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu && !registro.atributoGanhou); }

    get temPontoTrocaRetiraLivre(): boolean { return this.pontoTrocaRetiraLivre >= 0; }
    get temPontoTrocaGanhaLivre(): boolean { return this.pontoTrocaGanhaLivre >= 0; }
    //
    // #endregion

    // #region Validação Botões
    //
    atributoTemPontoAdicionadoEmGanho(atributo: AtributoDto): boolean { return this.pontosDeGanho.some(registro => registro.atributo?.id === atributo.id); }

    atributoTemPontoRemovidoEmTroca(atributo: AtributoDto): boolean { return this.pontosDeTroca.some(registro => registro.atributoPerdeu?.id === atributo.id); }
    atributoTemPontoAdicionadoEmTroca(atributo: AtributoDto): boolean { return this.pontosDeTroca.some(registro => registro.atributoGanhou?.id === atributo.id); }

    botaoAdicionarEstaHabilitado(atributoFicha: AtributoFichaDto) { return (atributoFicha.valor < this.valorMaxAtributo && (this.temPontoGanhoLivre || this.temPontoTrocaGanhaLivre)); }
    botaoRemoverEstaHabilitado(atributoFicha: AtributoFichaDto) { return (atributoFicha.valor > this.valorMinAtributo && (this.temPontoTrocaRetiraLivre || this.atributoTemPontoAdicionadoEmGanho(atributoFicha.atributo) || this.atributoTemPontoAdicionadoEmTroca(atributoFicha.atributo))); }
    //
    // #endregion

    // #region Metodos Botões
    //
    adicionaPonto(atributo: AtributoDto) {
        // prioridade 1 para desfazer uma remoção de troca
        if (this.atributoTemPontoRemovidoEmTroca(atributo)) {
            this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu?.id === atributo.id)].atributoGanhou = null;
            this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu?.id === atributo.id)].atributoPerdeu = null;
        }

        // prioridade 2 para completar trocas que já foram feitas
        else if (this.temPontoTrocaGanhaLivre) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu && !registro.atributoGanhou)]!.atributoGanhou = atributo;

        // ganho normal
        else if (this.temPontoGanhoLivre) this.pontosDeGanho[this.pontoGanhoLivre].atributo = atributo;
    }

    subtraiPonto(atributo: AtributoDto) {
        // prioridade 1 para remover trocas que adicionaram nesse atributo
        if (this.atributoTemPontoAdicionadoEmTroca(atributo)) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoGanhou?.id === atributo.id)].atributoGanhou = null;

        // prioridade 2 para remover ganhos que adicionaram nesse atributo
        else if (this.atributoTemPontoAdicionadoEmGanho(atributo)) this.pontosDeGanho[this.pontosDeGanho.findIndex(registro => registro.atributo?.id === atributo.id)].atributo = null;

        // remover ponto que será trocado
        else if (this.temPontoTrocaRetiraLivre) this.pontosDeTroca[this.pontoTrocaRetiraLivre]!.atributoPerdeu = atributo;
    }
    //
    // #endregion
}

export class EtapaGanhoEvolucao_Pericias extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Perícias';
    public pontosDeGanho: RegistroDeUsoDeGanhoDeMelhoriaDePatente[];
    public pontosDeTroca: RegistroDeUsoDeTrocaDeMelhoriaDePatente[];

    constructor(listaGanhosComObjetoPatente: { ganho: DadosGanho_Pericias, patente: PatentePericiaDto }[]) {
        super();

        this.pontosDeGanho = listaGanhosComObjetoPatente.reduce((acc, objetoGanho) => {
            const pontos = Array.from({ length: objetoGanho.ganho.ganhos }, () => ({
                patente: GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === objetoGanho.ganho.idPatente)!,
                pericia: null
            }));

            return [...acc, ...pontos];
        }, [] as RegistroDeUsoDeGanhoDeMelhoriaDePatente[]);

        // implementar
        this.pontosDeTroca = [];
    }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            ...(
                GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const registros = this.pontosDeGanho.filter(registro => registro.patente.id === patente.id);

                    if (registros.length === 0) return null;

                    const itemPrincipal = {
                        mensagem: `Ganho de ${registros.length} Perícias ${pluralize(registros.length, patente.nome)}`,
                        icone: (!this.temQualquerPontoGanhoPendente ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
                    };

                    const subitens = registros.map(registroPonto => {
                        if (registroPonto.pericia) {
                            return {
                                mensagem: `Melhorada Perícia ${registroPonto.pericia.nome}`,
                                icone: '',
                                tipo: 'subitem' as const
                            };
                        } else {
                            return {
                                mensagem: 'Melhoria Pendente',
                                icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                tipo: 'subitem' as const
                            };
                        }
                    });

                    return [itemPrincipal, ...subitens];
                }).filter(item => item !== null).flat()
            )
        ];
    };

    get finalizado(): boolean { return !this.temQualquerPontoGanhoPendente; } // implementar verificacao de troca em andamento

    // #region Logica de Pontos de Ganho
    // / Simplesmente aumenta o id da patente
    // / Obrigatório gastar todos os pontos recebidos
    //
    get obtemNumeroPontosGanhoPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeGanho.filter(registro => registro.patente.id === patente.id).length; }
    get obtemNumeroPontosGanhoLivresPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeGanho.filter(registro => registro.patente.id === (patente.id + 1) && registro.pericia === null) || []).length; }
    // tem q verificar o ponto referente a patente de cima
    get pontoGanhoLivrePorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeGanho.findIndex(registro => registro.patente.id === (patente.id + 1) && registro.pericia === null); }
    get temQualquerPontoGanhoPendente(): boolean { return this.pontosDeGanho.findIndex(registro => registro.pericia === null) >= 0; }
    get temPontoGanhoLivrePorPatente(): (patente: PatentePericiaDto) => boolean { return (patente: PatentePericiaDto) => this.pontoGanhoLivrePorPatente(patente) >= 0; }
    //
    // #endregion

    // #region Logica de Pontos de Troca
    //
    get obtemNumeroPontosTrocaPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeTroca.filter(registro => registro.patente.id === (patente.id + 1)).length; }
    get obtemNumeroPontosTrocaLivresPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeTroca.filter(registro => registro.patente.id === (patente.id + 1) && !registro.periciaPerdeu) || []).length; }
    get obtemNumeroPontosTrocaEmAndamentoPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeTroca.filter(registro => registro.patente.id === (patente.id + 1) && registro.periciaPerdeu && !registro.periciaGanhou) || []).length; }
    //
    // #endregion

    // #region Validação Botões
    //
    periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.pontosDeGanho.some(registro => registro.pericia?.id === pericia.id && registro.patente.id === patenteAtual.id); }

    botaoAdicionarEstaHabilitado(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return (this.temPontoGanhoLivrePorPatente(patenteAtual)); }
    botaoRemoverEstaHabilitado(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia, patenteAtual); }
    //
    // #endregion

    // #region Metodos Botões
    //
    adicionaPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto) {
        // ganho normal
        if (this.temPontoGanhoLivrePorPatente(patenteAtual)) this.pontosDeGanho[this.pontoGanhoLivrePorPatente(patenteAtual)].pericia = pericia;
    }

    subtraiPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto) {
        if (this.periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia, patenteAtual)) this.pontosDeGanho[this.pontosDeGanho.findIndex(registro => registro.pericia?.id === pericia.id && registro.patente.id >= patenteAtual.id)].pericia = null;

    }
    //
    // #endregion
}

export class EtapaGanhoEvolucao_MelhoriasRituais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Melhoria de Ritual';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_Rituais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Rituais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_HabilidadesParanormais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Paranormais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }

    constructor() {
        super();
    }
}

export class EtapaGanhoEvolucao_HabilidadesElementais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Elementais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }

    constructor() {
        super();
    }
}

type AvisoGanhoEvolucao = {
    mensagem: string,
    icone: ReactNode,
    tipo?: 'subitem',
}

export type EstatisticasDanificaveisEmEdicao = Record<number, { valorAtual: number, ganhoDaEvolucao: number, valorTotal: number }>;



interface ContextoEdicaoFichaProps {
    registraEventoAtualizacaoPagina: (callback: React.Dispatch<React.SetStateAction<any>>) => void;
    executaEAtualiza: (execucao: () => void) => void;
    personagemEmEdicao: PersonagemDto;
    paginaAberta: () => ReactNode;
    ganhos: GanhosEvolucao;
};

const ContextoEdicaoFicha = createContext<ContextoEdicaoFichaProps | undefined>(undefined);

export const useContextoEdicaoFicha = (): ContextoEdicaoFichaProps => {
    const context = useContext(ContextoEdicaoFicha);
    if (!context) throw new Error('useContextoEdicaoFicha precisa estar dentro de um ContextoEdicaoFicha');
    return context;
};

export const ContextoEdicaoFichaProvider = ({ children }: { children: React.ReactNode }) => {
    const { personagemEvoluindo } = useContextoEvoluindoPersonagem();
    const [personagemEmEdicao, setPersonagemEmEdicao] = useState<PersonagemDto | null>(null);
    const [ganhos, setGanhos] = useState<GanhosEvolucao | null>(null);

    const setStateRef = useRef<React.Dispatch<React.SetStateAction<Record<string, any>>> | null>(null);
    const registraEventoAtualizacaoPagina = (callback: React.Dispatch<React.SetStateAction<any>>) => { setStateRef.current = callback; };
    const acionaEventoAtualizacaoPagina = () => { if (setStateRef.current) setStateRef.current((prev: Record<string, any>) => ({ ...prev, updated: true })); };

    const paginaAberta = () => {
        if (ganhos?.estaAbertoResumoInicial) return <ResumoInicial />;
        if (ganhos?.estaAbertoResumoFinal) return <ResumoFinal />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Classes) return <SelecaoClasse />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_ValorMaxAtributo) return <InformativoAumentoMaximoAtributo />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Estatisticas) return <EdicaoEstatisticas />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesEspeciais) return <InformativoPontosHabilidadeEspecial />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Atributos) return <EdicaoAtributos />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Pericias) return <EdicaoPericias />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_MelhoriasRituais) return <InformativoPontosMelhoriaRitual />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Rituais) return <EdicaoRituais />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesParanormais) return <EdicaoHabilidadesParanormais />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesElementais) return <EdicaoHabilidadesElementais />;
    };

    function executaEAtualiza(execucao: () => void) {
        execucao();
        acionaEventoAtualizacaoPagina();
    }

    async function carregaGanhos() {
        if (personagemEmEdicao) {
            const ganhos = await obtemGanhosParaEvoluir(personagemEmEdicao?.fichaPendente?.nivel.id!, personagemEmEdicao?.fichaVigente?.detalhe.classe.id!);
            setGanhos(new GanhosEvolucao(personagemEmEdicao, { atributos: ganhos.listaReferenciaTodosAtributos, pericias: ganhos.listaReferenciaTodasPericias, patentes: ganhos.listaReferenciaTodasPatentes }, ganhos.listaGanhos, ganhos.listaGanhosEstatisticasPorAtributos));
        }
    }

    useEffect(() => {
        setPersonagemEmEdicao(personagemEvoluindo);
    }, []);

    useEffect(() => {
        carregaGanhos();
    }, [personagemEmEdicao]);

    if (!personagemEmEdicao) return;

    if (!paginaAberta) return;

    if (ganhos === null) return;

    return (
        <ContextoEdicaoFicha.Provider value={{ registraEventoAtualizacaoPagina, executaEAtualiza, personagemEmEdicao, paginaAberta, ganhos }}>
            {children}
        </ContextoEdicaoFicha.Provider>
    );
};
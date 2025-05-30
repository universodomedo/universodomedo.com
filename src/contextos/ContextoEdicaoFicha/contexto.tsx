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
import EdicaoHabilidadesParanormais from 'Componentes/EdicaoFicha/paginas-etapas/edicao-habilidades-paranormais.tsx';
import EdicaoHabilidadesElementais from 'Componentes/EdicaoFicha/paginas-etapas/edicao-habilidades-elementais.tsx';

import { obtemGanhosAposSelecaoClasse, obtemGanhosParaEvoluir } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AtributoDto, AtributoFicha, ClasseDto, DadosDoTipoGanho, DadosGanho_Atributos, DadosGanho_Classes, DadosGanho_Estatisticas, DadosGanho_Pericias, DadosGanho_PontosHabilidadeElemental, DadosGanho_PontosHabilidadesEspeciais, DadosGanho_PontosHabilidadesParanormais, DadosGanho_ValorMaximoAtributo, DetalheEvolucao, DetalheFicha, EstatisticaDanificavelDto, EstatisticaDanificavelFicha, FichaDeJogo, FichaPersonagemDto, GanhoEstatisticaAtributoClasseDto, GanhoNivelClasseDto, NivelDto, ObjetoGanhosEvolucao, PatentePericiaDto, PericiaDto, PericiaFicha, PersonagemDto, TipoGanhoNivelDto } from 'types-nora-api';
import { pluralize } from 'Uteis/UteisTexto/pluralize';

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
import React from 'react';

export class GanhosEvolucao {
    public ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[] = [];
    public etapas: EtapaGanhoEvolucao[] = [];
    public indexEtapaEmAndamento: number = 0;
    public estaAbertoResumoInicial: boolean = false;
    public estaAbertoResumoFinal: boolean = false;

    constructor(
        public personagemAtual: PersonagemDto,
        public fichaDeJogoVigente: FichaDeJogo,
        public nivelDoProcedimento: NivelDto,
        public metodoSalvarFicha: (fichaEditada: FichaPersonagemDto, fichaDeJogoEditada: FichaDeJogo) => Promise<boolean>,
        public metodoDeselecionarPersonagem: () => void,
        // esse callback só é utilizado quando alterando classe no GEP 2
        public recuperaGanhosAposSelecaoClasse: (idClasse: number) => Promise<ObjetoGanhosEvolucao>,
        dadosReferencia: { atributos: AtributoDto[], patentes: PatentePericiaDto[], pericias: PericiaDto[], estatisticasDanificaveis: EstatisticaDanificavelDto[], classes: ClasseDto[], tiposGanho: TipoGanhoNivelDto[] },
        ganhosEmJson: GanhoNivelClasseDto[],
        ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[]
    ) {
        GanhosEvolucao.dadosReferencia = dadosReferencia;
        this.inicializaProcessoEvolucao(ganhosEmJson, ganhosEstatisticasPorAtributo);
    }

    // #region Inicializa
    inicializaProcessoEvolucao = (ganhosEmJson: GanhoNivelClasseDto[], ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[]) => {
        this.etapas = GanhosEvolucao.formataGanhos(ganhosEmJson, this.fichaDeJogoVigente.detalhe);
        this.ganhosEstatisticasPorAtributo = ganhosEstatisticasPorAtributo;

        this.estaAbertoResumoInicial = true;
        this.estaAbertoResumoFinal = false;
        this.indexEtapaEmAndamento = 0;
    }
    // #endregion

    // #region Logicas Especiais
    // essa propriedade apenas é utilizada no GEP 2
    public classeSelecionadaNessaEvolucao: ClasseDto | null = null;

    selecionaClasse = async () => {
        const etapaClasses = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Classes)!;
        this.classeSelecionadaNessaEvolucao = GanhosEvolucao.dadosReferencia.classes.find(classe => classe.id === etapaClasses.classeEmSelecao.id)!;
        await this.refazBuscaGanhosClasse();
    }

    deselecionaClasse = async () => {
        this.classeSelecionadaNessaEvolucao = null;
        await this.refazBuscaGanhosClasse();
    }

    private refazBuscaGanhosClasse = async () => {
        const ganhosEvolucaoClasseSelecionadaEmJson = await this.recuperaGanhosAposSelecaoClasse(this.classeSelecionadaNessaEvolucao?.id ?? 1);
        this.inicializaProcessoEvolucao(ganhosEvolucaoClasseSelecionadaEmJson.listaGanhos, ganhosEvolucaoClasseSelecionadaEmJson.listaGanhosEstatisticasPorAtributos);
    }
    // #endregion

    // #region Logica de Etapa
    //
    get cabecalhoEvolucao(): string[] {
        return [
            `${this.personagemAtual.informacao.nome} - ${!this.personagemAtual.fichaVigente?.nivel ? 'Criando Ficha' : `Evoluindo para ${this.nivelDoProcedimento.nomeVisualizacao}`}`,
            this.estaAbertoResumoInicial ? 'Resumo Inicial' : this.estaAbertoResumoFinal ? 'Resumo Final' : this.etapaAtual.tituloEtapa,
        ];
    }
    get etapaAtual(): EtapaGanhoEvolucao { return this.etapas[this.indexEtapaEmAndamento]; }

    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapaEmAndamento === 0; }
    get estaNaUltimaEtapa(): boolean { return this.indexEtapaEmAndamento === (this.etapas.length - 1); }

    get estaEmPaginaDeResumo(): boolean { return this.estaAbertoResumoInicial || this.estaAbertoResumoFinal; }
    //
    // #endregion

    // #region Logica de Botões
    //
    get textoBotaoProximo(): string { return this.estaAbertoResumoInicial ? 'Começar' : this.estaAbertoResumoFinal ? 'Finalizar' : this.etapaAtual instanceof EtapaGanhoEvolucao_Classes ? 'Selecionar' : 'Continuar'; }
    get podeAvancarEtapa(): boolean { return this.estaEmPaginaDeResumo || (this.etapaAtual != null && this.etapaAtual.finalizado); }
    avancaEtapa = async () => {
        if (this.estaAbertoResumoInicial)
            this.estaAbertoResumoInicial = false;
        else if (this.estaAbertoResumoFinal)
            this.metodoSalvarFicha(this.fichaEvoluida, this.fichaDeJogoEvoluida);
        else if (this.etapaAtual instanceof EtapaGanhoEvolucao_Classes)
            await this.selecionaClasse();
        else if (this.estaNaUltimaEtapa)
            this.estaAbertoResumoFinal = true;
        else
            this.indexEtapaEmAndamento++;
    }


    get textoBotaoAnterior(): string { return this.estaAbertoResumoInicial && this.classeSelecionadaNessaEvolucao ? 'Cancelar' : this.estaAbertoResumoInicial ? 'Sair' : 'Voltar'; }
    retrocedeEtapa = async () => {
        if (this.estaAbertoResumoInicial && this.classeSelecionadaNessaEvolucao)
            await this.deselecionaClasse();
        else if (this.estaAbertoResumoInicial)
            this.metodoDeselecionarPersonagem();
        else if (this.estaAbertoResumoFinal)
            this.estaAbertoResumoFinal = false;
        else if (this.estaNaPrimeiraEtapa)
            this.estaAbertoResumoInicial = true;
        else
            this.indexEtapaEmAndamento--;
    }
    //
    // #endregion 

    // #region Elementos de Edição
    //
    get fichaEvoluida(): FichaPersonagemDto {
        return {
            ...this.personagemAtual.fichaVigente!,
            fkPersonagensId: this.personagemAtual.id,
            fkNiveisId: this.personagemAtual.fichaVigente ? this.personagemAtual.fichaVigente.nivel.id + 1 : 1,
            detalhesEvolucao: this.detalhesEvolucao,
        };
    }

    get fichaDeJogoEvoluida(): FichaDeJogo {
        return {
            ...this.fichaDeJogoVigente,
            atributos: this.atributosEditados,
            pericias: this.periciasEditadas,
            estatisticasDanificaveis: this.estatisticasDanificaveisEditadas,
            detalhe: this.detalheEditado,
            classe: this.classeSelecionadaNessaEvolucao ? this.classeSelecionadaNessaEvolucao : this.fichaDeJogoVigente.classe,
        };
    }

    private get atributosEditados(): AtributoFicha[] {
        const etapaAtributos = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos);

        return this.fichaDeJogoVigente.atributos.sort((a, b) => a.atributo.id - b.atributo.id).map(atributoFicha => ({
            ...atributoFicha,
            valor:
                atributoFicha.valor
                + (etapaAtributos?.pontosDeGanho.filter(r => r.atributo?.id === atributoFicha.atributo.id).length ?? 0)
                + (etapaAtributos?.pontosDeTroca.filter(t => t.atributoGanhou?.id === atributoFicha.atributo.id).length ?? 0)
                - (etapaAtributos?.pontosDeTroca.filter(t => t.atributoPerdeu?.id === atributoFicha.atributo.id).length ?? 0)
        })) ?? [];
    }

    private get periciasEditadas(): PericiaFicha[] {
        const etapaPericias = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias);

        return GanhosEvolucao.dadosReferencia.pericias.map(pericia => {
            const essaPericiaEmFicha = this.fichaDeJogoVigente.pericias.find(periciaFicha => periciaFicha.pericia.id === pericia.id);

            return !essaPericiaEmFicha
                ? {
                    pericia: pericia,
                    patentePericia: GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === 1 + (etapaPericias?.pontosDeGanho.filter(pontos => pontos.pericia?.id === pericia.id).length ?? 0) + (etapaPericias?.pontosDeTroca.filter(pontos => pontos.periciaGanhou?.id === pericia.id).length ?? 0) - (etapaPericias?.pontosDeTroca.filter(pontos => pontos.periciaPerdeu?.id === pericia.id).length ?? 0))!,
                    valorEfeito: 0,
                    valorTotal: 0,
                    detalhesValor: [],
                }
                : {
                    ...essaPericiaEmFicha,
                    patentePericia: GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === essaPericiaEmFicha.patentePericia.id + (etapaPericias?.pontosDeGanho.filter(pontos => pontos.pericia?.id === essaPericiaEmFicha.pericia.id).length ?? 0) + (etapaPericias?.pontosDeTroca.filter(pontos => pontos.periciaGanhou?.id === essaPericiaEmFicha.pericia.id).length ?? 0) - (etapaPericias?.pontosDeTroca.filter(pontos => pontos.periciaPerdeu?.id === essaPericiaEmFicha.pericia.id).length ?? 0))!
                };
        }).sort((a, b) => a.pericia.id - b.pericia.id);
    }

    get periciasEditadasEAgrupadas(): { atributo: AtributoDto, periciasDesseAtributo: PericiaFicha[] }[] {
        return GanhosEvolucao.dadosReferencia.atributos.sort((a, b) => a.id - b.id).map(atributo => ({
            atributo,
            periciasDesseAtributo: this.periciasEditadas.filter(periciaFicha => periciaFicha.pericia.atributo.id === atributo.id).sort((a, b) => a.pericia.id - b.pericia.id),
        }))
    }

    get valorEstatisticaPorAtributo(): (estatistica: EstatisticaDanificavelDto, atributo: AtributoDto) => number {
        return (estatistica: EstatisticaDanificavelDto, atributo: AtributoDto) => {
            return (
                this.atributosEditados.find(atributoFichaEditado => atributoFichaEditado.atributo.id === atributo.id)!.valor
                * this.ganhosEstatisticasPorAtributo.find(ganho => ganho.estatisticaDanificavel.id === estatistica.id && ganho.atributo.id === atributo.id)!.valorPorUnidade
            );
        }
    };

    get valorEstatisticaFixo(): (estatistica: EstatisticaDanificavelDto) => number {
        const etapaEstatisticas = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Estatisticas);

        return (estatistica: EstatisticaDanificavelDto) => {
            return etapaEstatisticas?.dadosGanhoAgrupados.find(ganhoEstatistica => ganhoEstatistica.idEstatistica === estatistica.id)!.valorAumento!;
        }
    }

    get valorTotalGanhadoPorEstatistica(): (estatisticaDanificavel: EstatisticaDanificavelDto) => number {
        // por enquant vou deixar o processo de ganho de estatistica fixa hardcoded e sobreescrevendo o ganho de estatistica de atributo, ja q n tem evolucao q ganha os 2 por enquanto
        if (this.nivelDoProcedimento.id === 2)
            return (estatisticaDanificavel: EstatisticaDanificavelDto) => this.valorEstatisticaFixo(estatisticaDanificavel);

        if (this.nivelDoProcedimento.id === 1)
            return (estatisticaDanificavel: EstatisticaDanificavelDto) => Math.ceil(GanhosEvolucao.dadosReferencia.atributos.reduce((acc, cur) => acc + this.valorEstatisticaPorAtributo(estatisticaDanificavel, cur), 0));

        return (estatisticaDanificavel: EstatisticaDanificavelDto) => {
            const valor = GanhosEvolucao.dadosReferencia.atributos.reduce((acc, cur) => acc + this.valorEstatisticaPorAtributo(estatisticaDanificavel, cur), 0);

            return Math.round(valor * 10) / 10;
        };
    }

    private get estatisticasDanificaveisEditadas(): EstatisticaDanificavelFicha[] {
        return this.fichaDeJogoVigente.estatisticasDanificaveis.sort((a, b) => a.estatisticaDanificavel.id - b.estatisticaDanificavel.id).map(estatisticaFicha => {
            return {
                ...estatisticaFicha,
                valorMaximo: (Math.round((estatisticaFicha.valorMaximo + this.valorTotalGanhadoPorEstatistica(estatisticaFicha.estatisticaDanificavel)) * 10) / 10),
            };
        });
    }

    private get detalheEditado(): DetalheFicha {
        return {
            ...this.fichaDeJogoVigente.detalhe,
            valorMaxAtributo: this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_ValorMaxAtributo)?.valorMaximoNovo ?? this.fichaDeJogoVigente.detalhe.valorMaxAtributo,
            pontosDeHabilidadeEspecial: this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesEspeciais)?.quantidadeDePontosNova ?? this.fichaDeJogoVigente.detalhe.pontosDeHabilidadeEspecial,
            pontosDeHabilidadeParanormal: this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais)?.quantidadeDePontosNova ?? this.fichaDeJogoVigente.detalhe.pontosDeHabilidadeParanormal,
        };
    }

    get detalhesEvolucao(): DetalheEvolucao[] {
        return [
            ...(this.classeSelecionadaNessaEvolucao ? [{
                etapa: `Seleção de Classe`,
                detalhes: [`Você selecionou a Classe ${this.classeSelecionadaNessaEvolucao.nome}`],
            }] : []),
            ...this.etapas.map(etapa => ({
                etapa: etapa.tituloEtapa,
                detalhes: etapa.detalhesEvolucaoEtapa,
            })),
            {
                etapa: 'Estatísticas Danificáveis',
                detalhes: this.estatisticasDanificaveisEditadas.map(estatisticaDanificavelEditada => (
                    `${estatisticaDanificavelEditada.estatisticaDanificavel.nome}: ${this.fichaDeJogoVigente.estatisticasDanificaveis.find(estatisticaDanificavelAnteriormente => estatisticaDanificavelAnteriormente.estatisticaDanificavel.id === estatisticaDanificavelEditada.estatisticaDanificavel.id)!.valorMaximo} → ${estatisticaDanificavelEditada.valorMaximo}`
                ))
            }
        ];
    }
    //
    // #endregion

    // #region Propriedades Estaticas
    //
    static dadosReferencia: { atributos: AtributoDto[], patentes: PatentePericiaDto[], pericias: PericiaDto[], estatisticasDanificaveis: EstatisticaDanificavelDto[], classes: ClasseDto[], tiposGanho: TipoGanhoNivelDto[] };

    static formataGanhos(ganhosEmJson: GanhoNivelClasseDto[], detalhesFicha: DetalheFicha): EtapaGanhoEvolucao[] {
        console.log(`formataGanhos`);
        console.log(ganhosEmJson);
        const retorno: EtapaGanhoEvolucao[] = [];

        let aumentoDeValorMaximoAtributoNessaEvolucao = detalhesFicha.valorMaxAtributo;

        GanhosEvolucao.dadosReferencia.tiposGanho.sort((a, b) => a.ordem - b.ordem).map(tipoGanho => {
            const ganhosDesseTipo = ganhosEmJson.filter(ganho => ganho.tipoGanhoNivel.id === tipoGanho.id);

            if (ganhosDesseTipo.length < 1) return;

            const dadosDesseGanho = ganhosDesseTipo.map(ganho => ganho.dados);

            switch (tipoGanho.id) {
                case 1:
                    // Alterações de Atributos
                    retorno.push(new EtapaGanhoEvolucao_Atributos(dadosDesseGanho as DadosGanho_Atributos[], aumentoDeValorMaximoAtributoNessaEvolucao));
                    break;
                case 2:
                    // Alterações de Perícias
                    retorno.push(new EtapaGanhoEvolucao_Pericias(dadosDesseGanho as DadosGanho_Pericias[]));
                    break;
                case 3:
                    // Alterações de Estatísticas
                    retorno.push(new EtapaGanhoEvolucao_Estatisticas(dadosDesseGanho as DadosGanho_Estatisticas[]));
                    break;
                case 4:
                    // Seleção de Classe
                    retorno.push(new EtapaGanhoEvolucao_Classes(dadosDesseGanho as DadosGanho_Classes[]));
                    break;
                case 5:
                    // Aumento de Valor Máximo de Atributo

                    // tem q ter certeza q essa logica acontece antes do push da etapa de Atributos
                    const listaDados = dadosDesseGanho as DadosGanho_ValorMaximoAtributo[];
                    aumentoDeValorMaximoAtributoNessaEvolucao += listaDados.length;

                    retorno.push(new EtapaGanhoEvolucao_ValorMaxAtributo(listaDados, detalhesFicha.valorMaxAtributo))
                    break;
                case 6:
                    // Ganho de Pontos de Habilidades Especial
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesEspeciais(dadosDesseGanho as DadosGanho_PontosHabilidadesEspeciais[], detalhesFicha.pontosDeHabilidadeEspecial));
                    break;
                case 7:
                    // Ganho de Pontos de Habilidades Paranormal
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesParanormais(dadosDesseGanho as DadosGanho_PontosHabilidadesParanormais[], detalhesFicha.pontosDeHabilidadeParanormal));
                    break;
                case 8:
                    // Ganho de Pontos de Habilidade Elemental
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesElementais(dadosDesseGanho as DadosGanho_PontosHabilidadeElemental[]));
                    break;
            }
        });

        return retorno;
    }
    // #endregion
}

type RegistroDeUsoDeGanhoDeAtributo = { atributo: AtributoDto | null };
type RegistroDeUsoDeTrocaDeAtributo = { atributoPerdeu: AtributoDto | null, atributoGanhou: AtributoDto | null };
type RegistroDeUsoDeGanhoDeMelhoriaDePatente = { patente: PatentePericiaDto, pericia: PericiaDto | null; paramsLivre?: { patenteDepoisDaEvolucao: number } };
type RegistroDeUsoDeTrocaDeMelhoriaDePatente = { periciaPerdeu: PericiaDto | null, periciaGanhou: PericiaDto | null, patente: PatentePericiaDto };

abstract class EtapaGanhoEvolucao {
    public abstract tituloEtapa: string;
    public abstract hrefDefinicaoEtapa: string | null;
    public abstract get avisosGanhoEvolucao(): AvisoGanhoEvolucao[];
    public abstract get finalizado(): boolean;
    public abstract listaDadosGanho: DadosDoTipoGanho[];
    public abstract dadosGanhoAgrupados: DadosDoTipoGanho;
    public abstract agrupaDadosDessaEtapa: () => DadosDoTipoGanho;
    public abstract get detalhesEvolucaoEtapa(): string[];
}

export class EtapaGanhoEvolucao_Classes extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Seleção de Classe';
    public hrefDefinicaoEtapa = '/definicoes/Classes';
    public idClasseEmSelecao: number = GanhosEvolucao.dadosReferencia.classes[0].id;

    public listaDadosGanho: DadosGanho_Classes[];
    public dadosGanhoAgrupados: DadosGanho_Classes;

    agrupaDadosDessaEtapa = (): DadosGanho_Classes => {
        return { selecao: true };
    }

    constructor(listaDadosGanho: DadosGanho_Classes[]) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return [{ mensagem: `Classe selecionada: ${this.classeEmSelecao.nome}`, icone: '', },]; }

    public get detalhesEvolucaoEtapa(): string[] { return [`Classe Selecionada: ${this.classeEmSelecao.nome}`]; }

    get classeEmSelecao(): ClasseDto {
        return GanhosEvolucao.dadosReferencia.classes.find(classe => classe.id === this.idClasseEmSelecao)!;
    }
}

export class EtapaGanhoEvolucao_ValorMaxAtributo extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Valor Máximo de Atributo';
    public hrefDefinicaoEtapa = null;
    public valorMaximoAnterior: number;
    public valorMaximoNovo: number = 0;

    public listaDadosGanho: DadosGanho_ValorMaximoAtributo[];
    public dadosGanhoAgrupados: DadosGanho_ValorMaximoAtributo;

    agrupaDadosDessaEtapa = (): DadosGanho_ValorMaximoAtributo => {
        this.valorMaximoNovo = this.valorMaximoAnterior + this.listaDadosGanho.length;
        return { aumento: true };
    }

    constructor(listaDadosGanho: DadosGanho_ValorMaximoAtributo[], valorMaximoAnterior: number) {
        super();

        this.valorMaximoAnterior = valorMaximoAnterior;

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: 'Seu Valor Máximo de Atributo foi aumentado', icone: '', },
            { mensagem: `De ${this.valorMaximoAnterior} para ${this.valorMaximoNovo}`, icone: '', tipo: 'subitem' },
        ];
    }

    public get detalhesEvolucaoEtapa(): string[] { return [`Valor Máximo de Atributo aumentado de ${this.valorMaximoAnterior} para ${this.valorMaximoNovo}`]; }
}

export class EtapaGanhoEvolucao_Estatisticas extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Estatísticas';
    public hrefDefinicaoEtapa = '/definicoes/EstatisticasDanificaveis';

    public listaDadosGanho: DadosGanho_Estatisticas[];
    public dadosGanhoAgrupados: DadosGanho_Estatisticas;

    agrupaDadosDessaEtapa = (): DadosGanho_Estatisticas => {
        const dadosAchatados = this.listaDadosGanho.flat();

        return dadosAchatados.reduce((acc, cur) => {
            const itemExistente = acc.find(item => item.idEstatistica === cur.idEstatistica);

            if (itemExistente) {
                itemExistente.valorAumento += cur.valorAumento;
            } else {
                acc.push({ ...cur });
            }

            return acc;
        }, [] as DadosGanho_Estatisticas);
    }

    constructor(listaDadosGanho: DadosGanho_Estatisticas[]) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return this.dadosGanhoAgrupados.map(ganhoEstatistica => {
            const estatistica = GanhosEvolucao.dadosReferencia.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.id === ganhoEstatistica.idEstatistica);

            return ({
                mensagem: `${estatistica?.nome} aumentados em ${ganhoEstatistica.valorAumento} Pontos`,
                icone: '',
            })
        });
    }

    public get detalhesEvolucaoEtapa(): string[] {
        return this.dadosGanhoAgrupados.map(ganhoEstatistica => {
            const estatistica = GanhosEvolucao.dadosReferencia.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.id === ganhoEstatistica.idEstatistica);

            return `${estatistica?.nome} aumentado em ${ganhoEstatistica.valorAumento} Pontos`;
        });
    }
}

export class EtapaGanhoEvolucao_HabilidadesEspeciais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Habilidade Especial';
    public hrefDefinicaoEtapa = '/definicoes/HabilidadesEspeciais';
    public quantidadeDePontosAumento: number = 0;
    get quantidadeDePontosNova(): number { return this.quantidadeDePontosAtual + this.quantidadeDePontosAumento; }

    public listaDadosGanho: DadosGanho_PontosHabilidadesEspeciais[];
    public dadosGanhoAgrupados: DadosGanho_PontosHabilidadesEspeciais;

    agrupaDadosDessaEtapa = (): DadosGanho_PontosHabilidadesEspeciais => {
        return this.listaDadosGanho.reduce((acc, cur) => ({
            valorAumento: acc.valorAumento + cur.valorAumento,
        }), { valorAumento: 0 });
    }

    constructor(listaDadosGanho: DadosGanho_PontosHabilidadesEspeciais[], public quantidadeDePontosAtual: number) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        this.quantidadeDePontosAumento = this.dadosGanhoAgrupados.valorAumento;
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: `Pontos de Habilidade Especial aumentados`, icone: '' },
            { mensagem: `De ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova} ${pluralize(this.quantidadeDePontosNova, 'Ponto')}`, icone: '', tipo: 'subitem' },
        ];
    }

    public get detalhesEvolucaoEtapa(): string[] { return [`Pontos de Habilidade Especial aumentados de ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova}`]; }
}

export class EtapaGanhoEvolucao_Atributos extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Atributos';
    public hrefDefinicaoEtapa = '/definicoes/Atributos';
    public pontosDeGanho: RegistroDeUsoDeGanhoDeAtributo[];
    public pontosDeTroca: RegistroDeUsoDeTrocaDeAtributo[];
    public valorMaxAtributo: number;
    public valorMinAtributo: number = 0;

    public listaDadosGanho: DadosGanho_Atributos[];
    public dadosGanhoAgrupados: DadosGanho_Atributos;

    agrupaDadosDessaEtapa = (): DadosGanho_Atributos => {
        return this.listaDadosGanho.reduce((acc, cur) => ({
            ganhos: acc.ganhos + cur.ganhos,
            trocas: acc.trocas + cur.trocas,
        }), { ganhos: 0, trocas: 0 });
    }

    constructor(listaDadosGanho: DadosGanho_Atributos[], valorMaxAtributo: number) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        this.pontosDeGanho = Array.from({ length: this.dadosGanhoAgrupados.ganhos }, () => ({ atributo: null }));
        this.pontosDeTroca = Array.from({ length: this.dadosGanhoAgrupados.trocas }, () => ({ atributoPerdeu: null, atributoGanhou: null }));
        this.valorMaxAtributo = valorMaxAtributo;
    }

    get finalizado(): boolean { return !this.temPontoGanhoLivre && this.obtemNumeroPontosTrocaEmAndamento === 0; }

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
                            this.pontosDeGanho.map(ganho => {
                                return ganho.atributo
                                    ? {
                                        mensagem: `Aumento de ${ganho.atributo.nome}`,
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
                            this.pontosDeTroca.filter(troca => troca.atributoPerdeu).map(troca => {
                                return troca.atributoGanhou
                                    ? {
                                        mensagem: `Trocado 1 Ponto de ${troca.atributoPerdeu?.nome} para ${troca.atributoGanhou.nome}`,
                                        icone: ``,
                                        tipo: 'subitem' as const,
                                    }
                                    : {
                                        mensagem: `Trocando 1 Ponto de ${troca.atributoPerdeu?.nome} (Pendente)`,
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

    public get detalhesEvolucaoEtapa(): string[] {
        return GanhosEvolucao.dadosReferencia.atributos.map(atributo => {
            const pontos = this.pontosDeGanho.filter(p => p.atributo?.id === atributo.id).length + this.pontosDeTroca.filter(t => t.atributoGanhou?.id === atributo.id).length - this.pontosDeTroca.filter(t => t.atributoPerdeu?.id === atributo.id).length;

            if (pontos === 0) return null;

            const delta = Math.abs(pontos);

            return `${atributo.nome} ${pontos > 0 ? 'aumentou' : 'diminuiu'} em ${delta} ${pluralize(delta, 'Ponto')}`;
        }).filter(Boolean) as string[];
    }

    // #region Logica de Pontos de Ganho
    // / Simplesmente soma no valor do Atributo
    // / Obrigatório gastar todos os pontos recebidos
    //
    get obtemNumeroPontosGanho(): number { return this.pontosDeGanho.length; }
    get obtemNumeroPontosGanhoLivres(): number { return (this.pontosDeGanho.filter(registro => !registro.atributo) || []).length; }
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

    botaoAdicionarEstaHabilitado(atributoFicha: AtributoFicha) { return (atributoFicha.valor < this.valorMaxAtributo && (this.temPontoGanhoLivre || this.temPontoTrocaGanhaLivre)); }
    botaoRemoverEstaHabilitado(atributoFicha: AtributoFicha) { return (atributoFicha.valor > this.valorMinAtributo && (this.temPontoTrocaRetiraLivre || this.atributoTemPontoAdicionadoEmGanho(atributoFicha.atributo) || this.atributoTemPontoAdicionadoEmTroca(atributoFicha.atributo))); }
    //
    // #endregion

    // #region Metodos Botões
    //
    adicionaPonto(atributo: AtributoDto) {
        // prioridade 1 para desfazer uma remoção de troca
        if (this.atributoTemPontoRemovidoEmTroca(atributo)) {
            const indexRegistroDeAtributoEmTroca = this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu?.id === atributo.id);

            this.pontosDeTroca[indexRegistroDeAtributoEmTroca].atributoGanhou = null;
            this.pontosDeTroca[indexRegistroDeAtributoEmTroca].atributoPerdeu = null;
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
    public hrefDefinicaoEtapa = '/definicoes/Pericias';
    public pontosDeGanho: RegistroDeUsoDeGanhoDeMelhoriaDePatente[];
    public pontosDeTroca: RegistroDeUsoDeTrocaDeMelhoriaDePatente[];

    public listaDadosGanho: DadosGanho_Pericias[];
    public dadosGanhoAgrupados: DadosGanho_Pericias;

    agrupaDadosDessaEtapa = (): DadosGanho_Pericias => {
        const livre = this.listaDadosGanho.reduce((acc, { livre }) => {
            if (!livre) return acc;

            return {
                ganhos: (acc?.ganhos || 0) + livre.ganhos,
                trocas: (acc?.trocas || 0) + livre.trocas
            };
        }, undefined as { ganhos: number; trocas: number } | undefined);

        const comum = this.listaDadosGanho.flatMap(item => item.comum || []).reduce((acc, { idPatente, ganhos, trocas }) => {
            const existente = acc.find(item => item.idPatente === idPatente);

            if (existente) {
                existente.ganhos += ganhos;
                existente.trocas += trocas;
            } else {
                acc.push({ idPatente, ganhos, trocas });
            }

            return acc;
        }, [] as { idPatente: number; ganhos: number; trocas: number }[]);

        return {
            ...(livre ? { livre } : {}),
            ...(comum.length > 0 ? { comum } : {})
        };
    }

    constructor(listaDadosGanho: DadosGanho_Pericias[]) {
        super();

        this.listaDadosGanho = listaDadosGanho.flat();
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        this.pontosDeGanho = [
            ...(this.dadosGanhoAgrupados.comum?.flatMap(dado => {
                const patente = GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === dado.idPatente)!;
                return Array.from({ length: dado.ganhos }, () => ({
                    patente: patente,
                    pericia: null
                }));
            }) || [])
        ];

        this.pontosDeTroca = [
            ...(this.dadosGanhoAgrupados.comum?.flatMap(dado => {
                const patente = GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === dado.idPatente)!;
                return Array.from({ length: dado.trocas }, () => ({
                    patente: patente,
                    periciaPerdeu: null,
                    periciaGanhou: null
                }));
            }) || []),
        ];
    }

    get finalizado(): boolean { return !this.temQualquerPontoGanhoPendente && !this.temQualquerPontoTrocaEmAndamento; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            ...(
                GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const ganhos = this.pontosDeGanho.filter(registro => registro.patente.id === patente.id);

                    if (ganhos.length === 0) return null;

                    const itemPrincipal = {
                        mensagem: `Ganho de ${ganhos.length} ${pluralize(ganhos.length, 'Perícia')} ${pluralize(ganhos.length, patente.nome)}`,
                        icone: (!this.temPontoGanhoLivrePorPatente(patente) ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
                    };

                    const subitens = ganhos.map(registroGanho => {
                        if (registroGanho.pericia) {
                            return {
                                mensagem: `Melhorada Perícia ${registroGanho.pericia.nome}`,
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
            ),
            ...(
                GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const trocas = this.pontosDeTroca.filter(registro => registro.patente.id === patente.id);

                    if (trocas.length === 0) return null;

                    const itemPrincipal = {
                        mensagem: `Troca Opcional de ${trocas.length} ${pluralize(trocas.length, 'Perícia')} ${pluralize(trocas.length, patente.nome)}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }),
                    };

                    // `Troca Opcional de ${this.obtemNumeroPontosTroca} ${pluralize(this.obtemNumeroPontosTroca, 'Atributo')} ${this.obtemNumeroPontosTrocaLivres > 0 ? `(${this.obtemNumeroPontosTrocaLivres} ${pluralize(this.obtemNumeroPontosTrocaLivres, 'Disponível', 'Disponíveis')})` : '(Usado)'}`,

                    const subitens = trocas.filter(troca => troca.periciaPerdeu).map(registroTroca => {
                        if (registroTroca.periciaGanhou) {
                            return {
                                mensagem: `Trocado ${patente.nome} de ${registroTroca.periciaPerdeu?.nome} para ${registroTroca.periciaGanhou.nome}`,
                                icone: ``,
                                tipo: 'subitem' as const,
                            };
                        } else {
                            return {
                                mensagem: `Trocando ${patente.nome} de ${registroTroca.periciaPerdeu?.nome} (Pendente)`,
                                icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                tipo: 'subitem' as const,
                            };
                        }
                    });

                    return [itemPrincipal, ...subitens];
                }).filter(item => item !== null).flat()
            )
        ];
    };

    public get detalhesEvolucaoEtapa(): string[] {
        return GanhosEvolucao.dadosReferencia.pericias.flatMap(pericia => {
            const getExtremo = (arr: { patente: PatentePericiaDto }[], comparador: (a: number, b: number) => boolean) => arr.length ? arr.reduce((a, b) => comparador(a.patente.id, b.patente.id) ? a : b).patente : null;

            const melhorPatente = getExtremo([
                ...this.pontosDeGanho.filter(p => p.pericia?.id === pericia.id),
                ...this.pontosDeTroca.filter(t => t.periciaGanhou?.id === pericia.id)
            ], (a, b) => a > b);

            const piorPatente = getExtremo(this.pontosDeTroca.filter(t => t.periciaPerdeu?.id === pericia.id), (a, b) => a < b);

            return [
                ...(melhorPatente ? [`${pericia.nome} melhorou para ${melhorPatente.nome}`] : []),
                ...(piorPatente ? [`${pericia.nome} piorou para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === (piorPatente.id - 1))?.nome}`] : [])
            ];
        });
    }

    // #region Logica de Pontos de Ganho
    // / Simplesmente aumenta o id da patente
    // / Obrigatório gastar todos os pontos recebidos
    //
    get obtemNumeroPontosGanhoPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeGanho.filter(registro => registro.patente.id === patente.id).length; }
    get obtemNumeroPontosGanhoLivresPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeGanho.filter(registro => registro.patente.id === (patente.id + 1) && registro.pericia === null) || []).length; }
    // tem q verificar o ponto referente a patente de cima
    get pontoGanhoLivrePorPatente(): (patente: PatentePericiaDto, verificaProxPatente?: boolean) => number { return (patente: PatentePericiaDto, verificaProxPatente?: boolean) => this.pontosDeGanho.findIndex(registro => registro.patente.id === (patente.id + (verificaProxPatente ? 1 : 0)) && registro.pericia === null); }

    get temPontoGanhoLivrePorPatente(): (patente: PatentePericiaDto, verificaProxPatente?: boolean) => boolean { return (patente: PatentePericiaDto, verificaProxPatente?: boolean) => this.pontoGanhoLivrePorPatente(patente, verificaProxPatente) >= 0; }

    get temQualquerPontoGanhoPendente(): boolean { return this.pontosDeGanho.some(registro => registro.pericia === null); }
    //
    // #endregion

    // #region Logica de Pontos de Troca
    //
    get obtemNumeroPontosTrocaPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeTroca.filter(registro => registro.patente.id === patente.id).length; }
    get obtemNumeroPontosTrocaLivresPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeTroca.filter(registro => registro.patente.id === (patente.id + 1) && !registro.periciaPerdeu) || []).length; }
    get obtemNumeroPontosTrocaEmAndamentoPorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => (this.pontosDeTroca.filter(registro => registro.patente.id === (patente.id + 1) && registro.periciaPerdeu && !registro.periciaGanhou) || []).length; }

    get pontoTrocaRetiraLivrePorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeTroca.findIndex(registro => !registro.periciaPerdeu && registro.patente.id === patente.id); }
    get pontoTrocaGanhaLivrePorPatente(): (patente: PatentePericiaDto) => number { return (patente: PatentePericiaDto) => this.pontosDeTroca.findIndex(registro => registro.periciaPerdeu && !registro.periciaGanhou && registro.patente.id === (patente.id + 1)); }

    get temPontoTrocaRetiraLivrePorPatente(): (patente: PatentePericiaDto) => boolean { return (patente: PatentePericiaDto) => this.pontoTrocaRetiraLivrePorPatente(patente) >= 0; }
    get temPontoTrocaGanhaLivrePorPatente(): (patente: PatentePericiaDto) => boolean { return (patente: PatentePericiaDto) => this.pontoTrocaGanhaLivrePorPatente(patente) >= 0; }

    get temQualquerPontoTrocaEmAndamento(): boolean { return this.pontosDeTroca.some(registro => registro.periciaPerdeu && !registro.periciaGanhou); }
    //
    // #endregion

    // #region Validação Botões
    //
    periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.pontosDeGanho.some(registro => registro.pericia?.id === pericia.id && registro.patente.id === patenteAtual.id); }

    periciaTemPontoRemovidoEmTrocaNessaPatente(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.pontosDeTroca.some(registro => registro.periciaPerdeu?.id === pericia.id && registro.patente.id === (patenteAtual.id + 1)); }
    periciaTemPontoAdicionadoEmTrocaNessaPatente(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.pontosDeTroca.some(registro => registro.periciaGanhou?.id === pericia.id && registro.patente.id === patenteAtual.id); }

    botaoAdicionarEstaHabilitado(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.temPontoGanhoLivrePorPatente(patenteAtual, true) || this.temPontoTrocaGanhaLivrePorPatente(patenteAtual); }
    botaoRemoverEstaHabilitado(pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean { return this.temPontoTrocaRetiraLivrePorPatente(patenteAtual) || this.periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia, patenteAtual) || this.periciaTemPontoAdicionadoEmTrocaNessaPatente(pericia, patenteAtual); }
    //
    // #endregion

    // #region Metodos Botões
    //
    adicionaPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto) {
        // prioridade 1 para desfazer uma remoção de troca
        if (this.periciaTemPontoRemovidoEmTrocaNessaPatente(pericia, patenteAtual)) {
            const indexRegistroDePericiaEmTroca = this.pontosDeTroca.findIndex(registro => registro.periciaPerdeu?.id === pericia.id && registro.patente.id === (patenteAtual.id + 1));

            this.pontosDeTroca[indexRegistroDePericiaEmTroca].periciaGanhou = null;
            this.pontosDeTroca[indexRegistroDePericiaEmTroca].periciaPerdeu = null;
        }

        // prioridade 2 para completar trocas que já foram feitas
        else if (this.temPontoTrocaGanhaLivrePorPatente(patenteAtual)) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.periciaPerdeu && !registro.periciaGanhou && registro.patente.id === (patenteAtual.id + 1))]!.periciaGanhou = pericia;

        // ganho normal
        else if (this.temPontoGanhoLivrePorPatente(patenteAtual, true)) this.pontosDeGanho[this.pontoGanhoLivrePorPatente(patenteAtual, true)].pericia = pericia;
    }

    subtraiPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto) {
        // prioridade 1 para remover trocas que adicionaram nessa perícia
        if (this.periciaTemPontoAdicionadoEmTrocaNessaPatente(pericia, patenteAtual)) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.periciaGanhou?.id === pericia.id)].periciaGanhou = null;

        // prioridade 2 para remover ganhos que adicionaram nessa perícia
        else if (this.periciaTemPontoAdicionadoEmGanhoNessaPatente(pericia, patenteAtual)) this.pontosDeGanho[this.pontosDeGanho.findIndex(registro => registro.pericia?.id === pericia.id && registro.patente.id >= patenteAtual.id)].pericia = null;

        // remover ponto que será trocado
        else if (this.temPontoTrocaRetiraLivrePorPatente(patenteAtual)) this.pontosDeTroca[this.pontoTrocaRetiraLivrePorPatente(patenteAtual)]!.periciaPerdeu = pericia;
    }
    //
    // #endregion
}

export class EtapaGanhoEvolucao_HabilidadesParanormais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Paranormais';
    public hrefDefinicaoEtapa = '/definicoes/HabilidadesParanormais';
    public quantidadeDePontosAumento: number = 0;
    get quantidadeDePontosNova(): number { return this.quantidadeDePontosAtual + this.quantidadeDePontosAumento; }

    public listaDadosGanho: DadosGanho_PontosHabilidadesParanormais[];
    public dadosGanhoAgrupados: DadosGanho_PontosHabilidadesParanormais;

    agrupaDadosDessaEtapa = (): DadosGanho_PontosHabilidadesParanormais => {
        return this.listaDadosGanho.reduce((acc, cur) => ({
            valorAumento: acc.valorAumento + cur.valorAumento,
        }), { valorAumento: 0 });
    }

    constructor(listaDadosGanho: DadosGanho_PontosHabilidadesParanormais[], public quantidadeDePontosAtual: number) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        this.quantidadeDePontosAumento = this.dadosGanhoAgrupados.valorAumento;
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: `Pontos de Habilidade Paranormal aumentados`, icone: '' },
            { mensagem: `De ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova} ${pluralize(this.quantidadeDePontosNova, 'Ponto')}`, icone: '', tipo: 'subitem' },
        ];
    }

    public get detalhesEvolucaoEtapa(): string[] { return [`Pontos de Habilidade Paranormal aumentados de ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova}`]; }
}

export class EtapaGanhoEvolucao_HabilidadesElementais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Elementais';
    public hrefDefinicaoEtapa = '/definicoes/HabilidadesEspeciais';

    public listaDadosGanho: DadosGanho_PontosHabilidadeElemental[];
    public dadosGanhoAgrupados: DadosGanho_PontosHabilidadeElemental;

    agrupaDadosDessaEtapa = (): DadosGanho_PontosHabilidadeElemental => {
        return this.listaDadosGanho.reduce((acc, cur) => ({
            valorAumento: acc.valorAumento + cur.valorAumento,
        }), { valorAumento: 0 });
    }

    constructor(listaDadosGanho: DadosGanho_PontosHabilidadeElemental[]) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }

    public get detalhesEvolucaoEtapa(): string[] {
        return [

        ];
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
    const { personagemEvoluindo, salvarEvolucao, deselecionaPersonagemEvoluindo } = useContextoEvoluindoPersonagem();
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
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Atributos) return <EdicaoAtributos />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_Pericias) return <EdicaoPericias />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesEspeciais) return <InformativoPontosHabilidadeEspecial />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesParanormais) return <EdicaoHabilidadesParanormais />;
        if (ganhos?.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesElementais) return <EdicaoHabilidadesElementais />;
    };

    async function executaEAtualiza(execucao: () => void | Promise<void>) {
        await Promise.resolve(execucao());
        acionaEventoAtualizacaoPagina();
    }

    function criarMetodoSalvarEvolucao(salvarEvolucao: (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => Promise<boolean>): (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => Promise<boolean> {
        return async (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => {
            const sucesso = await salvarEvolucao(fichaEvoluida, fichaDeJogoEvoluida);

            if (!sucesso) {
                alert("Erro ao salvar a evolução do personagem.");
            } else {
                window.location.reload();
            }

            return sucesso;
        };
    }

    function criarMetodoDeselecionarPersonagem(): () => void {
        return () => {
            deselecionaPersonagemEvoluindo();
        };
    }

    async function recuperaGanhosAposSelecaoClasse(idClasse: number): Promise<ObjetoGanhosEvolucao> {
        return await obtemGanhosAposSelecaoClasse(idClasse);
    }

    async function carregaGanhos() {
        if (personagemEmEdicao) {
            const ganhos = await obtemGanhosParaEvoluir(personagemEmEdicao.id);

            setGanhos(new GanhosEvolucao(
                ganhos.personagem,
                ganhos.fichaDeJogoVigente,
                ganhos.nivelDoProcedimento,
                criarMetodoSalvarEvolucao(salvarEvolucao),
                criarMetodoDeselecionarPersonagem(),
                // metodo em desenvolvimeento
                recuperaGanhosAposSelecaoClasse,
                { atributos: ganhos.listaReferenciaTodosAtributos, pericias: ganhos.listaReferenciaPericiasDisponiveis, patentes: ganhos.listaReferenciaTodasPatentes, estatisticasDanificaveis: ganhos.listaReferenciaTodasEstatisticasDanificaveis, classes: ganhos.listaReferenciaTodasClasses, tiposGanho: ganhos.listaReferenciaTodosTiposGanho },
                ganhos.listaGanhos, ganhos.listaGanhosEstatisticasPorAtributos
            ));
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
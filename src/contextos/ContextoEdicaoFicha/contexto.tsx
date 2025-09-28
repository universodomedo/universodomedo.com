'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto'
import { useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';

import ResumoInicial from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/resumo-inicial.tsx';
import ResumoFinal from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/resumo-final.tsx';
import SelecaoClasse from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/selecao-classe.tsx';
import InformativoAumentoMaximoAtributo from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/informativo-aumento-maximo-atributo.tsx';
import EdicaoEstatisticas from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/edicao-estatisticas.tsx';
import InformativoPontosHabilidadeEspecial from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/informativo-pontos-habilidade-especial.tsx';
import EdicaoAtributos from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/edicao-atributos.tsx';
import EdicaoPericias from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/edicao-pericias.tsx';
import EdicaoHabilidadesParanormais from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/informativo-aumento-habilidades-paranormais';
import EdicaoHabilidadesElementais from 'Componentes/PaginaPersonagem/componentes/EdicaoFicha/paginas-etapas/informativo-aumento-habilidades-elementais';

import { obtemGanhosAposSelecaoClasse, obtemGanhosParaEvoluir, salvarEvolucaoDoPersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AtributoDto, AtributoFicha, ClasseDto, DadosDoTipoGanho, DadosGanho_Atributos, DadosGanho_Classes, DadosGanho_Estatisticas, DadosGanho_Pericias, DadosGanho_PontosHabilidadeElemental, DadosGanho_PontosHabilidadesEspeciais, DadosGanho_PontosHabilidadesParanormais, DadosGanho_ValorMaximoAtributo, DetalheEvolucao, DetalheFicha, EstatisticaDanificavelDto, EstatisticaDanificavelFicha, FichaDeJogo, FichaPersonagemDto, GanhoEstatistica, GanhoNivelClasseDto, IPericia, NivelDto, ObjetoGanhosEvolucao, PatentePericiaDto, PericiaDto, PericiaFicha, PersonagemDto, RegistroPericiaLivre, TipoGanhoNivelDto } from 'types-nora-api';
import { pluralize } from 'Uteis/UteisTexto/pluralize';
import { PAGINA_PERSONAGEM } from 'Componentes/PaginaPersonagem/types';


export class GanhosEvolucao {
    public ganhosEstatisticasPorAtributo: GanhoEstatistica[] = [];
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
        ganhosEstatisticasPorAtributo: GanhoEstatistica[]
    ) {
        GanhosEvolucao.dadosReferencia = dadosReferencia;
        this.inicializaProcessoEvolucao(ganhosEmJson, ganhosEstatisticasPorAtributo);
    }

    // #region Inicializa
    inicializaProcessoEvolucao = (ganhosEmJson: GanhoNivelClasseDto[], ganhosEstatisticasPorAtributo: GanhoEstatistica[]) => {
        this.etapas = GanhosEvolucao.formataGanhos(ganhosEmJson, this.fichaDeJogoVigente);
        this.ganhosEstatisticasPorAtributo = ganhosEstatisticasPorAtributo;

        this.estaAbertoResumoInicial = true;
        this.estaAbertoResumoFinal = false;
        this.indexEtapaEmAndamento = 0;
    }
    // #endregion

    // #region Logicas Especiais
    //

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

    // usado para montar mensagens e alterações quando evoluindo pericia Ocultismo (id 16), que aplica modificações em etapa de Habilidades Paranormais
    get evolucaoPericiaOcultismoNessaEvolucao(): { mostraMensagemExperiente: boolean, evoluiuParaExperiente: boolean, mostraMensagemDesperta: boolean, evoluiuParaDesperta: boolean, mostraMensagemVisionaria: boolean, evoluiuParaVisionaria: boolean, algumaMensagemParaExibir: boolean } {
        const periciaOriginal = this.fichaDeJogoVigente.pericias.find(p => p.pericia.id === 16);
        const patenteOriginalId = periciaOriginal?.patentePericia.id || 1;

        const periciaAtual = this.periciasEditadas.find(p => p.pericia.id === 16);
        const patenteAtualId = periciaAtual?.patentePericia.id || patenteOriginalId;

        const evoluiuParaExperiente = patenteOriginalId < 2 && patenteAtualId >= 2;
        const evoluiuParaDesperta = patenteOriginalId < 3 && patenteAtualId >= 3;
        const evoluiuParaVisionaria = patenteOriginalId < 4 && patenteAtualId >= 4;

        return {
            evoluiuParaExperiente: evoluiuParaExperiente,
            mostraMensagemExperiente: patenteOriginalId === 1,
            evoluiuParaDesperta: evoluiuParaDesperta,
            mostraMensagemDesperta: patenteOriginalId === 2 || evoluiuParaExperiente,
            evoluiuParaVisionaria: evoluiuParaVisionaria,
            mostraMensagemVisionaria: patenteOriginalId === 3 || evoluiuParaDesperta,
            algumaMensagemParaExibir: evoluiuParaExperiente || evoluiuParaDesperta || evoluiuParaVisionaria,
        };
    }

    get obtemPericiasLivresPresentesNessaPericia() { return (pericia: PericiaDto): RegistroPericiaLivre[] => this.detalhesPericiasLivres.filter(registro => registro.idPericia === pericia.id); }

    //
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
            classe: this.classeSelecionadaNessaEvolucao ? this.classeSelecionadaNessaEvolucao : this.fichaDeJogoVigente.classe,
            detalhe: this.detalheEditado,
            detalhesUsoEvolucaoPericiasLivres: this.detalhesPericiasLivres,
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

    get periciasEditadas(): PericiaFicha[] {
        const etapaPericias = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) as EtapaGanhoEvolucao_Pericias | undefined;
        const periciasModificadas = etapaPericias?.periciasAlteradas || [];

        return GanhosEvolucao.dadosReferencia.pericias.map(pericia => {
            const periciaModificada = periciasModificadas.find(p => p.pericia.id === pericia.id);
            const periciaOriginal = this.fichaDeJogoVigente.pericias.find(p => p.pericia.id === pericia.id);

            if (!periciaOriginal && periciaModificada) return periciaModificada;

            if (periciaOriginal && periciaModificada) return {
                ...periciaOriginal,
                patentePericia: periciaModificada.patentePericia
            }

            return periciaOriginal || {
                pericia: pericia,
                patentePericia: GanhosEvolucao.dadosReferencia.patentes[0],
                valorEfeito: 0,
                valorTotal: 0,
                detalhesValor: []
            };
        }).sort((a, b) => a.pericia.id - b.pericia.id);
    }

    get periciasEditadasEAgrupadas(): { atributo: AtributoDto; periciasDesseAtributo: PericiaFicha[] }[] {
        return GanhosEvolucao.dadosReferencia.atributos.sort((a, b) => a.id - b.id).map(atributo => ({
            atributo,
            periciasDesseAtributo: this.periciasEditadas.filter(periciaFicha => periciaFicha.pericia.atributo.id === atributo.id).sort((a, b) => a.pericia.id - b.pericia.id),
        }))
    }


    get detalhesPericiasLivres(): RegistroPericiaLivre[] {
        const etapaPericias = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) as EtapaGanhoEvolucao_Pericias | undefined;

        if (!etapaPericias) return [];

        return etapaPericias.registrosPericiasLivres.map(registro => {
            if (registro.tipo === 'adicionando') {
                return {
                    idPericia: registro.registro.idPericia,
                    idPatente: registro.registro.idPatente
                };
            } else {
                return {
                    idPericia: registro.registroDepois.idPericia,
                    idPatente: registro.registroDepois.idPatente,
                };
            }
        }).filter(registro => registro.idPericia !== null && registro.idPatente !== null) as RegistroPericiaLivre[];
    }

    get valorEstatisticaPorAtributo(): (estatisticaDanificavel: EstatisticaDanificavelDto, atributo: AtributoDto) => number {
        return (estatisticaDanificavel: EstatisticaDanificavelDto, atributo: AtributoDto) => {
            const ganhosDessaEstatistica = this.ganhosEstatisticasPorAtributo.find(ganhoEstatistica => ganhoEstatistica.estatisticaDanificavel.id === estatisticaDanificavel.id);
            const ganhosDessaEstatisticaParaEsseAtributo = ganhosDessaEstatistica?.ganhosPorAtributo.find(ganhoPorAtributo => ganhoPorAtributo.atributo.id === atributo.id);

            return (
                this.atributosEditados.find(atributoFichaEditado => atributoFichaEditado.atributo.id === atributo.id)!.valor
                * (ganhosDessaEstatisticaParaEsseAtributo?.valorPorUnidade || 0)
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
            pontosDeHabilidadeParanormal: (
                (this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais)?.quantidadeDePontosNova ?? this.fichaDeJogoVigente.detalhe.pontosDeHabilidadeParanormal)
                + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaExperiente ? 10 : 0)
                + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaDesperta ? 20 : 0)
                + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaVisionaria ? 30 : 0)
            ),
            pontosDeHabilidadeElemental: this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesElementais)?.quantidadeDePontosNova ?? this.fichaDeJogoVigente.detalhe.pontosDeHabilidadeElemental,
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
            ...(this.detalhesPericiasLivres.length > 0 ? (() => {
                const etapaPericias = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) as EtapaGanhoEvolucao_Pericias;

                return [{
                    etapa: 'Pontos de Perícia Livre',
                    detalhes: etapaPericias.registrosPericiasLivres.map(registroPericiaLivre => {
                        return registroPericiaLivre.tipo === 'adicionando'
                            ? `Adicionado novo Ponto Livre, evoluindo a Perícia ${GanhosEvolucao.dadosReferencia.pericias.find(pericia => pericia.id === registroPericiaLivre.registro.idPericia)?.nome} para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === registroPericiaLivre.registro.idPatente)?.nome}`
                            : registroPericiaLivre.registroAntes.idPericia === registroPericiaLivre.registroDepois.idPericia && registroPericiaLivre.registroAntes.idPatente === registroPericiaLivre.registroDepois.idPatente
                                ? `Mantendo o Ponto Livre que evolui a Perícia ${GanhosEvolucao.dadosReferencia.pericias.find(pericia => pericia.id === registroPericiaLivre.registroAntes.idPericia)?.nome} para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === registroPericiaLivre.registroAntes.idPatente)?.nome}`
                                : `Editando Ponto Livre que anteriormente evoluia a Perícia ${GanhosEvolucao.dadosReferencia.pericias.find(pericia => pericia.id === registroPericiaLivre.registroAntes.idPericia)?.nome} para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === registroPericiaLivre.registroAntes.idPatente)?.nome}, agora evolui a Perícia ${GanhosEvolucao.dadosReferencia.pericias.find(pericia => pericia.id === registroPericiaLivre.registroDepois.idPericia)?.nome} para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === registroPericiaLivre.registroDepois.idPatente)?.nome}`;
                    }),
                }];
            })() : []),
            ...(this.evolucaoPericiaOcultismoNessaEvolucao.algumaMensagemParaExibir ? (() => {
                const valorPontosHabilidadeParanormalSemOcultismo = this.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais)?.quantidadeDePontosNova ?? this.fichaDeJogoVigente.detalhe.pontosDeHabilidadeParanormal;

                const novoValorAposEvolucaoExperiente = valorPontosHabilidadeParanormalSemOcultismo + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaExperiente ? 10 : 0);
                const novoValorAposEvolucaoDesperta = novoValorAposEvolucaoExperiente + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaDesperta ? 20 : 0);
                const novoValorAposEvolucaoVisionaria = novoValorAposEvolucaoDesperta + (this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaVisionaria ? 30 : 0);

                return [{
                    etapa: `Evolução Ocultismo`,
                    detalhes: [
                        ...(this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaExperiente ? [`Ocultismo Experiente → +10 Pontos de Habilidade Paranormal (De ${valorPontosHabilidadeParanormalSemOcultismo} para ${novoValorAposEvolucaoExperiente})`] : []),
                        ...(this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaDesperta ? [`Ocultismo Desperto → +20 Pontos de Habilidade Paranormal (De ${novoValorAposEvolucaoExperiente} para ${novoValorAposEvolucaoDesperta})`] : []),
                        ...(this.evolucaoPericiaOcultismoNessaEvolucao.evoluiuParaVisionaria ? [`Ocultismo Visionário → +30 Pontos de Habilidade Paranormal (De ${novoValorAposEvolucaoDesperta} para ${novoValorAposEvolucaoVisionaria})`] : [])
                    ],
                }];
            })() : []),
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
    static ordenacaoAtual = 1;

    static obtemOrdenacaoAtual(): number { return GanhosEvolucao.ordenacaoAtual++; }

    static formataGanhos(ganhosEmJson: GanhoNivelClasseDto[], fichaDeJogo: FichaDeJogo): EtapaGanhoEvolucao[] {
        const retorno: EtapaGanhoEvolucao[] = [];

        let aumentoDeValorMaximoAtributoNessaEvolucao = fichaDeJogo.detalhe.valorMaxAtributo;

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
                    retorno.push(new EtapaGanhoEvolucao_Pericias(dadosDesseGanho as DadosGanho_Pericias[], fichaDeJogo.detalhesUsoEvolucaoPericiasLivres));
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

                    retorno.push(new EtapaGanhoEvolucao_ValorMaxAtributo(listaDados, fichaDeJogo.detalhe.valorMaxAtributo))
                    break;
                case 6:
                    // Ganho de Pontos de Habilidades Especial
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesEspeciais(dadosDesseGanho as DadosGanho_PontosHabilidadesEspeciais[], fichaDeJogo.detalhe.pontosDeHabilidadeEspecial));
                    break;
                case 7:
                    // Ganho de Pontos de Habilidades Paranormal
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesParanormais(dadosDesseGanho as DadosGanho_PontosHabilidadesParanormais[], fichaDeJogo.detalhe.pontosDeHabilidadeParanormal));
                    break;
                case 8:
                    // Ganho de Pontos de Habilidade Elemental
                    retorno.push(new EtapaGanhoEvolucao_HabilidadesElementais(dadosDesseGanho as DadosGanho_PontosHabilidadeElemental[], fichaDeJogo.detalhe.pontosDeHabilidadeElemental));
                    break;
            }
        });

        return retorno;
    }
    // #endregion
}

type RegistroDeUsoDeGanhoDeAtributo = { atributo: AtributoDto | null };
type RegistroDeUsoDeTrocaDeAtributo = { atributoPerdeu: AtributoDto | null; atributoGanhou: AtributoDto | null };

type RegistroDeUsoDeGanhoDeMelhoriaDePatente = { ordenacao: number | null; readonly id: number; patente: PatentePericiaDto; pericia: PericiaDto | null; }
type RegistroDeUsoDeGanhoDeMelhoriaLivreDePatente = { ordenacao: number | null; readonly id: number; patente: PatentePericiaDto | null; pericia: PericiaDto | null; }

type RegistroDeUsoDeTrocaDeMelhoriaDePatente = { ordenacaoPerda: number | null; ordenacaoGanho: number | null; readonly id: number; patente: PatentePericiaDto; periciaPerdeu: PericiaDto | null; periciaGanhou: PericiaDto | null; }
type RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente = { ordenacaoPerda: number | null; ordenacaoGanho: number | null; readonly id: number; indexRegistroPericiaLivre: number | null; ganhaPerdeMesmaPatente: boolean | null; patentePerdeu: PatentePericiaDto | null; periciaPerdeu: PericiaDto | null; patenteGanhou: PatentePericiaDto | null; periciaGanhou: PericiaDto | null; }

type RegistroPericiasLivresEmProgresso =
    { ordenacao: number | null; readonly idPontoDeGanhoLivre: number; readonly tipo: 'adicionando'; registro: { idPericia: number | null; idPatente: number | null; } }
    | { ordenacao: number | null; readonly indexRegistroPrevio: number; readonly tipo: 'adicionado'; registroAntes: { idPericia: number | null; idPatente: number | null; }; registroDepois: { idPericia: number | null; idPatente: number | null; }; };

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

// se possivel, em algum momento fazer as alterações de logica de verificação como esta na logica de Pericias
// como a validação de botao habilitado
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

    get finalizado(): boolean { return !this.temPontoGanhoDisponivel && this.obtemNumeroPontosTrocaEmAndamento === 0; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: `Valor de Atributo pode variar entre ${this.valorMinAtributo} e ${this.valorMaxAtributo}`, icone: '' },

            ...(
                this.obtemNumeroPontosGanho > 0
                    ? [
                        {
                            mensagem: `Ganho de ${this.obtemNumeroPontosGanho} ${pluralize(this.obtemNumeroPontosGanho, 'Atributo')} ${this.obtemNumeroPontosGanhoDisponiveis > 0 ? `(${this.obtemNumeroPontosGanhoDisponiveis} ${pluralize(this.obtemNumeroPontosGanhoDisponiveis, 'Restante')})` : '(Concluído)'}`,
                            icone: (!this.temPontoGanhoDisponivel ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
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
                            mensagem: `Troca Opcional de ${this.obtemNumeroPontosTroca} ${pluralize(this.obtemNumeroPontosTroca, 'Atributo')} ${this.obtemNumeroPontosTrocaDisponiveis > 0 ? `(${this.obtemNumeroPontosTrocaDisponiveis} ${pluralize(this.obtemNumeroPontosTrocaDisponiveis, 'Disponível', 'Disponíveis')})` : '(Usado)'}`,
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
    get obtemNumeroPontosGanhoDisponiveis(): number { return (this.pontosDeGanho.filter(registro => !registro.atributo) || []).length; }
    get pontoGanhoDisponivel(): number { return this.pontosDeGanho.findIndex(registro => registro.atributo === null); }
    get temPontoGanhoDisponivel(): boolean { return this.pontoGanhoDisponivel >= 0; }
    //
    // #endregion

    // #region Logica de Pontos de Troca
    // / Permite a Troca de um Ponto de um Atributo para outro
    // / / Ainda são levadas as regras de Valor Mínimo e Valor Máximo de Atributo
    // / Opcional gastar todos os pontos
    // / / Quando retirado um Atributo, obrigatório fazer a troca
    //
    get obtemNumeroPontosTroca(): number { return this.pontosDeTroca.length; }
    get obtemNumeroPontosTrocaDisponiveis(): number { return (this.pontosDeTroca.filter(registro => !registro.atributoPerdeu) || []).length; }
    get obtemNumeroPontosTrocaEmAndamento(): number { return (this.pontosDeTroca.filter(registro => registro.atributoPerdeu && !registro.atributoGanhou) || []).length; }

    get pontoTrocaRetiraDisponivel() { return this.pontosDeTroca.findIndex(registro => !registro.atributoPerdeu); }
    get pontoTrocaGanhaDisponivel() { return this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu && !registro.atributoGanhou); }

    get temPontoTrocaRetiraDisponivel(): boolean { return this.pontoTrocaRetiraDisponivel >= 0; }
    get temPontoTrocaGanhaDisponivel(): boolean { return this.pontoTrocaGanhaDisponivel >= 0; }
    //
    // #endregion

    // #region Validação Botões
    //
    atributoTemPontoAdicionadoEmGanho(atributo: AtributoDto): boolean { return this.pontosDeGanho.some(registro => registro.atributo?.id === atributo.id); }

    atributoTemPontoRemovidoEmTroca(atributo: AtributoDto): boolean { return this.pontosDeTroca.some(registro => registro.atributoPerdeu?.id === atributo.id); }
    atributoTemPontoAdicionadoEmTroca(atributo: AtributoDto): boolean { return this.pontosDeTroca.some(registro => registro.atributoGanhou?.id === atributo.id); }

    botaoAdicionarEstaHabilitado(atributoFicha: AtributoFicha) { return (atributoFicha.valor < this.valorMaxAtributo && (this.temPontoGanhoDisponivel || this.temPontoTrocaGanhaDisponivel)); }
    botaoRemoverEstaHabilitado(atributoFicha: AtributoFicha) { return (atributoFicha.valor > this.valorMinAtributo && (this.temPontoTrocaRetiraDisponivel || this.atributoTemPontoAdicionadoEmGanho(atributoFicha.atributo) || this.atributoTemPontoAdicionadoEmTroca(atributoFicha.atributo))); }
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
        else if (this.temPontoTrocaGanhaDisponivel) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoPerdeu && !registro.atributoGanhou)]!.atributoGanhou = atributo;

        // ganho normal
        else if (this.temPontoGanhoDisponivel) this.pontosDeGanho[this.pontoGanhoDisponivel].atributo = atributo;
    }

    subtraiPonto(atributo: AtributoDto) {
        // prioridade 1 para remover trocas que adicionaram nesse atributo
        if (this.atributoTemPontoAdicionadoEmTroca(atributo)) this.pontosDeTroca[this.pontosDeTroca.findIndex(registro => registro.atributoGanhou?.id === atributo.id)].atributoGanhou = null;

        // prioridade 2 para remover ganhos que adicionaram nesse atributo
        else if (this.atributoTemPontoAdicionadoEmGanho(atributo)) this.pontosDeGanho[this.pontosDeGanho.findIndex(registro => registro.atributo?.id === atributo.id)].atributo = null;

        // remover ponto que será trocado
        else if (this.temPontoTrocaRetiraDisponivel) this.pontosDeTroca[this.pontoTrocaRetiraDisponivel]!.atributoPerdeu = atributo;
    }
    //
    // #endregion
}

export class EtapaGanhoEvolucao_Pericias extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Perícias';
    public hrefDefinicaoEtapa = '/definicoes/Pericias';
    public pontosDeGanho: RegistroDeUsoDeGanhoDeMelhoriaDePatente[];
    public pontosDeTroca: RegistroDeUsoDeTrocaDeMelhoriaDePatente[];
    public pontosDeGanhoLivre: RegistroDeUsoDeGanhoDeMelhoriaLivreDePatente[];
    public pontosDeTrocaLivre: RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente[];

    public registrosPreviosPericiaLivre: RegistroPericiaLivre[];

    public listaDadosGanho: DadosGanho_Pericias[];
    public dadosGanhoAgrupados: DadosGanho_Pericias;

    // #region Documentação de Testes
    //

    //
    // // Aumentar Patente pelo Botão de Adicionar Ponto
    // !! Aumento em uma Patente

    // // // Caso 1: Aumentar uma Patente usando um Ganho
    // // // // Esperado 1: Patente aumenta em 1
    // // // // OBS Esperado 1: Apenas aplicavel quando a Perícia se encontra na Patente abaixo da disponibilizada pelo Ganho
    // // //

    // // // Caso 2: Aumentar uma Patente que foi retirada por uma Perda quando em processo de Troca
    // // // // Esperado 1: Patente aumenta em 1, voltando ao original antes da Troca
    // // // // OBS Esperado 1: Apenas aplicavel quando a Perícia sofreu Perda (inicio de Troca)
    // // // // OBS Esperado 2: A Troca em questão é zerada e volta pro estado de Disponível
    // // //

    // // // Caso 3: Aumentar uma Patente usando uma Troca
    // // // // Esperado 1: Patente aumenta em 1
    // // // // OBS Esperado 1: Apenas aplicavel quando a Perícia se encontra na Patente abaixo do ganho da Troca
    // // //

    // // // Caso 4: Aumentar uma Patente que foi retirada por uma Perda quando em processo de Troca, de uma mesma Perícia que recebeu uma Perícia Livre
    // // // // Esperado 1: Patente aumenta em 1, marcando uma troca de mesma Perícia e mesma Patente
    // // // // OBS Esperado 1: A Troca vai deve identificar que foi realizada para a MESMA PERICIA e MESMA PATENTE, porém foi gasta uma Perícia Livre de antemão
    // // //

    // //
    //

    //
    // // Diminuir Patente pelo Botão de Subtrair Ponto
    // !! Dimuição em uma Patente
    //

    //
    // #endregion

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

    constructor(listaDadosGanho: DadosGanho_Pericias[], registrosPreviosPericiaLivre: RegistroPericiaLivre[]) {
        super();

        this.listaDadosGanho = listaDadosGanho.flat();
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        let nextId = 1;

        this.pontosDeGanho = this.dadosGanhoAgrupados.comum?.flatMap(ganhoComum => {
            const patente = GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === ganhoComum.idPatente)!;
            return Array.from({ length: ganhoComum.ganhos }, () => ({ ordenacao: null, id: nextId++, patente: patente, pericia: null } as const));
        }) || [];

        this.pontosDeGanhoLivre = this.dadosGanhoAgrupados.livre?.ganhos
            ? Array.from({ length: this.dadosGanhoAgrupados.livre.ganhos }, () => ({ ordenacao: null, id: nextId++, patente: null, pericia: null } as const))
            : [];

        this.pontosDeTroca = this.dadosGanhoAgrupados.comum?.flatMap(ganhoComum => {
            const patente = GanhosEvolucao.dadosReferencia.patentes.find(p => p.id === ganhoComum.idPatente)!;
            return Array.from({ length: ganhoComum.trocas }, () => (
                { ordenacaoPerda: null, ordenacaoGanho: null, id: nextId++, patente: patente, periciaPerdeu: null, periciaGanhou: null } as const
            ));
        }) || [];

        this.pontosDeTrocaLivre = this.dadosGanhoAgrupados.livre?.trocas
            ? Array.from({ length: this.dadosGanhoAgrupados.livre.trocas }, () => (
                { ordenacaoPerda: null, ordenacaoGanho: null, id: nextId++, indexRegistroPericiaLivre: null, ganhaPerdeMesmaPatente: null, patentePerdeu: null, periciaPerdeu: null, patenteGanhou: null, periciaGanhou: null, } as const
            ))
            : [];

        this.registrosPreviosPericiaLivre = registrosPreviosPericiaLivre;
    }

    get registrosPericiasLivres(): RegistroPericiasLivresEmProgresso[] {
        return [
            ...this.pontosDeGanhoLivre.map(pontoGanhoLivre => ({ ordenacao: pontoGanhoLivre.ordenacao, idPontoDeGanhoLivre: pontoGanhoLivre.id, tipo: 'adicionando' as const, registro: { idPericia: pontoGanhoLivre.pericia?.id ?? null, idPatente: pontoGanhoLivre.patente?.id ?? null } })),
            ...this.registrosPreviosPericiaLivre.map((registroPrevio, indexRegistroPrevio) => {
                const alteracoesDesseRegistro = this.registrosTrocasLivresPerderam.find(trocaLivre => trocaLivre.indexRegistroPericiaLivre === indexRegistroPrevio);

                return { ordenacao: alteracoesDesseRegistro?.ordenacaoPerda || 1, indexRegistroPrevio: indexRegistroPrevio, tipo: 'adicionado' as const, registroAntes: { idPericia: registroPrevio.idPericia, idPatente: registroPrevio.idPatente }, registroDepois: { idPericia: alteracoesDesseRegistro?.id ? alteracoesDesseRegistro.periciaGanhou?.id ?? null : registroPrevio.idPericia, idPatente: alteracoesDesseRegistro?.id ? alteracoesDesseRegistro.patenteGanhou?.id ?? null : registroPrevio.idPatente } }
            }),
        ];
    };

    get periciasAlteradas(): PericiaFicha[] {
        const periciasAlteradas: IPericia[] = [
            ...this.pontosDeGanho.flatMap(ganho => ganho.pericia ? [ganho.pericia] : []),
            ...this.pontosDeGanhoLivre.flatMap(ganhoLivre => ganhoLivre.pericia ? [ganhoLivre.pericia] : []),
            ...this.pontosDeTroca.flatMap(troca => [
                ...(troca.periciaPerdeu ? [troca.periciaPerdeu] : []),
                ...(troca.periciaGanhou ? [troca.periciaGanhou] : []),
            ]),
            ...this.pontosDeTrocaLivre.flatMap(trocaLivre => [
                ...(trocaLivre.periciaPerdeu ? [trocaLivre.periciaPerdeu] : []),
                ...(trocaLivre.periciaGanhou ? [trocaLivre.periciaGanhou] : []),
            ]),
        ];

        return periciasAlteradas.map(pericia => {
            const todosRegistros = [
                ...this.pontosDeGanho.filter(ganho => ganho.pericia?.id === pericia.id).map(ganho => ({
                    tipo: 'melhoria' as const,
                    patente: ganho.patente,
                    ordenacao: ganho.ordenacao
                })),

                ...this.pontosDeGanhoLivre.filter(ganhoLivre => ganhoLivre.pericia?.id === pericia.id).map(ganhoLivre => ({
                    tipo: 'melhoria' as const,
                    patente: ganhoLivre.patente,
                    ordenacao: ganhoLivre.ordenacao
                })),

                ...this.pontosDeTroca.filter(troca => troca.periciaGanhou?.id === pericia.id).map(troca => ({
                    tipo: 'melhoria' as const,
                    patente: troca.patente,
                    ordenacao: troca.ordenacaoGanho
                })),

                ...this.pontosDeTroca.filter(troca => troca.periciaPerdeu?.id === pericia.id).map(troca => ({
                    tipo: 'piora' as const,
                    patente: troca.patente,
                    ordenacao: troca.ordenacaoPerda
                })),

                ...this.pontosDeTrocaLivre.filter(trocaLivre => trocaLivre.periciaGanhou?.id === pericia.id).map(trocaLivre => ({
                    tipo: 'melhoria' as const,
                    patente: trocaLivre.patenteGanhou,
                    ordenacao: trocaLivre.ordenacaoGanho
                })),

                ...this.pontosDeTrocaLivre.filter(trocaLivre => trocaLivre.periciaPerdeu?.id === pericia.id).map(trocaLivre => ({
                    tipo: 'piora' as const,
                    patente: trocaLivre.patentePerdeu,
                    ordenacao: trocaLivre.ordenacaoPerda
                }))
            ].filter(r => r.patente !== null && r.ordenacao !== null);

            const registroMaisRecente = todosRegistros.reduce((prev, current) => (prev.ordenacao! > current.ordenacao!) ? prev : current);

            return registroMaisRecente.tipo === 'melhoria'
                ? {
                    pericia,
                    patentePericia: registroMaisRecente.patente!,
                    valorEfeito: 0,
                    valorTotal: 0,
                    detalhesValor: []
                }
                : {
                    pericia,
                    patentePericia: GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === (registroMaisRecente.patente!.id - 1))!,
                    valorEfeito: 0,
                    valorTotal: 0,
                    detalhesValor: []
                };
        });
    }

    get finalizado(): boolean { return !this.obtemSeTemPontoGanhoDisponivel && !this.obtemSeTemPontoTrocaEmAndamento; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            ...(
                GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const ganhos = this.pontosDeGanho.filter(registro => registro.patente.id === patente.id);

                    if (ganhos.length === 0) return null;

                    const itemPrincipal = {
                        mensagem: `Ganho de ${ganhos.length} ${pluralize(ganhos.length, 'Perícia')} ${pluralize(ganhos.length, patente.nome)}`,
                        icone: (!this.obtemSeTemPontoGanhoDisponivelParaPatente(patente) ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
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
            ...(() => {
                const ganhosLivres = this.pontosDeGanhoLivre;

                if (ganhosLivres.length === 0) return [];

                const itemPrincipal = {
                    mensagem: `Ganho de ${ganhosLivres.length} ${pluralize(ganhosLivres.length, 'Perícia')} ${pluralize(ganhosLivres.length, 'Livre')}`,
                    icone: (!this.obtemSeTemPontoGanhoLivreDisponivel ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
                };

                const subitens = ganhosLivres.map(registroGanho => {
                    if (registroGanho.pericia) {
                        return {
                            mensagem: `Melhorada Perícia ${registroGanho.pericia.nome} para ${registroGanho.patente?.nome}`,
                            icone: '',
                            tipo: 'subitem' as const
                        };
                    } else {
                        return {
                            mensagem: 'Melhoria Livre Pendente',
                            icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                            tipo: 'subitem' as const
                        };
                    }
                });

                return [itemPrincipal, ...subitens];
            })(),
            ...(
                GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const trocasFixas = this.pontosDeTroca.filter(registro => registro.patente.id === patente.id);

                    if (trocasFixas.length === 0) return [];

                    const numeroPericiasDisponiveisParaPatente = this.obtemNumeroDeTrocasDisponiveisParaPatente(patente);
                    const itemPrincipal = {
                        mensagem: `Troca Opcional de ${trocasFixas.length} ${pluralize(trocasFixas.length, 'Perícia')} ${pluralize(trocasFixas.length, patente.nome)} ${numeroPericiasDisponiveisParaPatente > 0 ? `(${numeroPericiasDisponiveisParaPatente} ${pluralize(numeroPericiasDisponiveisParaPatente, 'Disponível', 'Disponíveis')})` : '(Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }),
                    };

                    const subitens = trocasFixas.filter(troca => troca.periciaPerdeu).map(registroTroca => {
                        return registroTroca.periciaGanhou
                            ? {
                                mensagem: `Trocado ${patente.nome} de ${registroTroca.periciaPerdeu?.nome} para ${registroTroca.periciaGanhou.nome}`,
                                icone: ``,
                                tipo: 'subitem' as const,
                            }
                            : {
                                mensagem: `Trocando ${patente.nome} de ${registroTroca.periciaPerdeu?.nome} (Pendente)`,
                                icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                tipo: 'subitem' as const,
                            }
                    });

                    return [itemPrincipal, ...subitens];
                }).filter(item => item !== null).flat()
            ),
            ...(() => {
                const trocasLivres = this.pontosDeTrocaLivre;

                if (trocasLivres.length === 0) return [];

                const trocasLivresDisponiveis = trocasLivres.filter(troca => !troca.periciaPerdeu && !troca.periciaGanhou);

                const itemPrincipal = {
                    mensagem: `Troca Opcional de ${trocasLivres.length} ${pluralize(trocasLivres.length, 'Perícia')} ${trocasLivresDisponiveis.length > 0 ? `(${trocasLivresDisponiveis.length} ${pluralize(trocasLivresDisponiveis.length, 'Disponível', 'Disponíveis')})` : '(Usado)'}`,
                    icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }),
                };

                const subitens = trocasLivres.filter(troca => troca.periciaPerdeu).map(registroTroca => {
                    return registroTroca.ganhaPerdeMesmaPatente
                        ? registroTroca.periciaGanhou
                            ? {
                                mensagem: `Trocado ${registroTroca.patentePerdeu?.nome} de ${registroTroca.periciaPerdeu?.nome} para ${registroTroca.patenteGanhou?.nome} de ${registroTroca.periciaGanhou.nome}`,
                                icone: ``,
                                tipo: 'subitem' as const,
                            }
                            : {
                                mensagem: `Trocando ${registroTroca.patentePerdeu?.nome} de ${registroTroca.periciaPerdeu?.nome} (Pendente)`,
                                icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                tipo: 'subitem' as const,
                            }
                        : registroTroca.periciaGanhou
                            ? {
                                mensagem: `Trocada Perícia Livre, tirando ${registroTroca.patentePerdeu?.nome} de ${registroTroca.periciaPerdeu?.nome} e adicionando ${registroTroca.patenteGanhou?.nome} em ${registroTroca.periciaGanhou.nome}`,
                                icone: ``,
                                tipo: 'subitem' as const,
                            }
                            : {
                                mensagem: `Trocando Perícia Livre, tirando ${registroTroca.patentePerdeu?.nome} de ${registroTroca.periciaPerdeu?.nome} (Pendente)`,
                                icone: React.createElement(Cross1Icon, { style: { color: '#FF0000' } }),
                                tipo: 'subitem' as const,
                            }
                });

                return [itemPrincipal, ...subitens];
            })(),
        ];
    };

    public get detalhesEvolucaoEtapa(): string[] {
        return GanhosEvolucao.dadosReferencia.pericias.flatMap(pericia => {
            const getExtremo = (arr: { patente: PatentePericiaDto }[], comparador: (a: number, b: number) => boolean) => arr.length ? arr.reduce((a, b) => comparador(a.patente.id, b.patente.id) ? a : b).patente : null;

            const pontosMelhoria = [
                ...this.pontosDeGanho.filter(ganho => ganho.pericia?.id === pericia.id).map(ganho => ({ patente: ganho.patente })),
                ...this.pontosDeTroca.filter(troca => troca.periciaGanhou?.id === pericia.id).map(troca => ({ patente: troca.patente })),
                ...this.pontosDeGanhoLivre.filter(ganhoLivre => ganhoLivre.pericia?.id === pericia.id && ganhoLivre.patente).map(ganhoLivre => ({ patente: ganhoLivre.patente! })),
                ...this.pontosDeTrocaLivre.filter(trocaLivre => trocaLivre.periciaGanhou?.id === pericia.id && trocaLivre.patenteGanhou).map(trocaLivre => ({ patente: trocaLivre.patenteGanhou! })),
            ];

            const pontosPiora = [
                ...this.pontosDeTroca.filter(troca => troca.periciaPerdeu?.id === pericia.id).map(troca => ({ patente: troca.patente })),
                ...this.pontosDeTrocaLivre.filter(trocaLivre => trocaLivre.periciaPerdeu?.id === pericia.id && trocaLivre.patentePerdeu).map(trocaLivre => ({ patente: trocaLivre.patentePerdeu! })),
            ]

            const melhorPatente = getExtremo(pontosMelhoria, (a, b) => a > b);
            const piorPatente = getExtremo(pontosPiora, (a, b) => a < b);

            return [
                ...(melhorPatente ? [`${pericia.nome} melhorou para ${melhorPatente.nome}`] : []),
                ...(piorPatente ? [`${pericia.nome} piorou para ${GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === (piorPatente.id - 1))?.nome}`] : [])
            ];
        });
    }

    // #region Agrupamentos de Registros
    //
    get registrosGanhosDisponiveis(): RegistroDeUsoDeGanhoDeMelhoriaDePatente[] { return this.pontosDeGanho.filter(ganho => !ganho.pericia); }
    get registrosGanhosRealizados(): RegistroDeUsoDeGanhoDeMelhoriaDePatente[] { return this.pontosDeGanho.filter(ganho => ganho.pericia); }

    get registrosGanhosLivresDisponiveis(): RegistroDeUsoDeGanhoDeMelhoriaLivreDePatente[] { return this.pontosDeGanhoLivre.filter(ganhoLivre => !ganhoLivre.pericia); }
    get registrosGanhosLivresRealizados(): RegistroDeUsoDeGanhoDeMelhoriaLivreDePatente[] { return this.pontosDeGanhoLivre.filter(ganhoLivre => ganhoLivre.pericia); }

    get registrosTrocasDisponiveis(): RegistroDeUsoDeTrocaDeMelhoriaDePatente[] { return this.pontosDeTroca.filter(troca => troca.periciaPerdeu === null); }
    get registrosTrocasPerderam(): RegistroDeUsoDeTrocaDeMelhoriaDePatente[] { return this.pontosDeTroca.filter(troca => troca.periciaPerdeu !== null); }
    get registrosTrocasApenasPerderam(): RegistroDeUsoDeTrocaDeMelhoriaDePatente[] { return this.pontosDeTroca.filter(troca => troca.periciaPerdeu !== null && troca.periciaGanhou === null); }
    get registrosTrocasPerderamEGanharam(): RegistroDeUsoDeTrocaDeMelhoriaDePatente[] { return this.pontosDeTroca.filter(troca => troca.periciaPerdeu !== null && troca.periciaGanhou !== null); }

    get registrosTrocasLivresDisponiveis(): RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente[] { return this.pontosDeTrocaLivre.filter(trocaLivre => trocaLivre.periciaPerdeu === null); }
    get registrosTrocasLivresPerderam(): RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente[] { return this.pontosDeTrocaLivre.filter(troca => troca.periciaPerdeu !== null); }
    get registrosTrocasLivresApenasPerderam(): RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente[] { return this.pontosDeTrocaLivre.filter(troca => troca.periciaPerdeu !== null && troca.periciaGanhou === null); }
    get registrosTrocasLivresPerderamEGanharam(): RegistroDeUsoDeTrocaDeMelhoriaLivreDePatente[] { return this.pontosDeTrocaLivre.filter(troca => troca.periciaPerdeu !== null && troca.periciaGanhou !== null); }
    //
    // #endregion

    // #region Limitadores
    //
    get patenteEstaAbaixoPatenteMaxima() { return (patente: PatentePericiaDto): boolean => patente.id < 4; }
    get patenteEstaAcimaPatenteMinima() { return (patente: PatentePericiaDto): boolean => patente.id > 1; }
    //
    // #endregion

    // #region Ganhos/Trocas Comuns - Busca de Ids
    //
    get obtemIdDoRegistroTrocaParaReveter() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.registrosTrocasPerderam.find(troca => troca.periciaPerdeu?.id === pericia.id && troca.patente.id === (patenteAtual.id + 1) && !troca.periciaGanhou)?.id ?? null; }
    get obtemIdDoRegistroTrocaQuePodeRealizarGanhoDessaPatente() { return (patente: PatentePericiaDto): number | null => this.registrosTrocasApenasPerderam.find(troca => troca.patente.id === (patente.id + 1))?.id ?? null; }
    get obtemIdDoRegistroGanhoQuePodeRealizarGanhoDessaPatente() { return (patente: PatentePericiaDto): number | null => this.registrosGanhosDisponiveis.find(ganho => ganho.patente.id === (patente.id + 1))?.id ?? null; }
    get obtemIdDoRegistroTrocaQueGanhouEssaPatentePericia() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.registrosTrocasPerderamEGanharam.find(troca => troca.periciaGanhou?.id === pericia.id && troca.patente.id === patenteAtual.id)?.id ?? null; }
    get obtemIdDoRegistroGanhoQueGanhouEssaPatentePericia() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.registrosGanhosRealizados.find(ganho => ganho.pericia?.id === pericia.id && ganho.patente?.id === patenteAtual.id)?.id ?? null; }
    get obtemIdDoRegistroTrocaQuePodeRealizarRetiradaPatente() { return (patente: PatentePericiaDto): number | null => this.registrosTrocasDisponiveis.find(troca => troca.patente.id === patente.id)?.id ?? null; }
    get obtemIdDoRegistroTrocaTirouPatenteParaGanharDenovo() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.obtemSeHouveGanhoDePericiaLivreNesseProcessoAbaixoDaPatenteAtual(pericia, patenteAtual) ? this.registrosTrocasApenasPerderam.find(troca => troca.periciaPerdeu?.id === pericia.id && troca.patente.id === (patenteAtual.id + 1))?.id ?? null : null; }
    //
    // #endregion

    // #region Ganhos/Trocas Livres - Busca de Ids
    //
    get obtemIdDoRegistroTrocaLivreQuePodeRetirarPatente() { return (): number | null => this.registrosTrocasLivresDisponiveis.find(() => true)?.id ?? null; }
    get obtemIdDoRegistroTrocaLivreParaReveter() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto, usaPericiaLivre: boolean): number | null => this.registrosTrocasLivresPerderam.find(trocaLivre => trocaLivre.periciaPerdeu?.id === pericia.id && trocaLivre.patentePerdeu?.id === (patenteAtual.id + 1) && !trocaLivre.periciaGanhou && ((usaPericiaLivre && !trocaLivre.ganhaPerdeMesmaPatente) || (!usaPericiaLivre && trocaLivre.ganhaPerdeMesmaPatente)))?.id ?? null; }
    get obtemIdDoRegistroTrocaLivreQuePodeRealizarGanho() { return (patenteAtual: PatentePericiaDto, usaPericiaLivre: boolean): number | null => this.registrosTrocasLivresApenasPerderam.find(trocaLivre => (!!trocaLivre.ganhaPerdeMesmaPatente && trocaLivre.patentePerdeu?.id === (patenteAtual.id + 1) || !trocaLivre.ganhaPerdeMesmaPatente) && ((usaPericiaLivre && !trocaLivre.ganhaPerdeMesmaPatente) || (!usaPericiaLivre && trocaLivre.ganhaPerdeMesmaPatente)))?.id ?? null; }
    get obtemIdDoRegistroTrocaLivreQueGanhouEssaPatentePericia() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto, usaPericiaLivre: boolean): number | null => this.registrosTrocasLivresPerderamEGanharam.find(trocaLivre => trocaLivre.periciaGanhou?.id === pericia.id && trocaLivre.patenteGanhou?.id === patenteAtual.id && ((usaPericiaLivre && !trocaLivre.ganhaPerdeMesmaPatente) || (!usaPericiaLivre && trocaLivre.ganhaPerdeMesmaPatente)))?.id ?? null; }
    get obtemIdDoRegistroGanhoLivreQuePodeRealizarGanho() { return (): number | null => this.registrosGanhosLivresDisponiveis.find(() => true)?.id ?? null; }
    get obtemIdDoRegistroGanhoLivreQueGanhouEssaPatentePericia() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.registrosGanhosLivresRealizados.find(ganho => ganho.pericia?.id === pericia.id && ganho.patente?.id === patenteAtual.id)?.id ?? null; }
    get obtemIdDoRegistroTrocaLivreTirouPatenteParaGanharDenovo() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): number | null => this.obtemSeHouveGanhoDePericiaLivreNesseProcessoAbaixoDaPatenteAtual(pericia, patenteAtual) ? this.registrosTrocasLivresApenasPerderam.find(trocaLivre => trocaLivre.periciaPerdeu?.id === pericia.id && trocaLivre.patentePerdeu?.id === (patenteAtual.id + 1))?.id ?? null : null; }

    get obtemSeEssaPericiaGanhouPatenteAtualPorPericiaLivreNesseProcesso() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => this.obtemIdDoRegistroGanhoLivreQueGanhouEssaPatentePericia(pericia, patenteAtual) !== null; }
    get obtemSeEssaPatentePericiaEhDevidoPericiaLivre() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => this.registrosPericiasLivres.some(registroPericiaLivre => (registroPericiaLivre.tipo === 'adicionando' && registroPericiaLivre.registro.idPericia === pericia.id && registroPericiaLivre.registro.idPatente === patenteAtual.id) || (registroPericiaLivre.tipo === 'adicionado' && registroPericiaLivre.registroDepois.idPericia === pericia.id && registroPericiaLivre.registroDepois.idPatente === patenteAtual.id)); }
    get obtemSeHouveGanhoDePericiaLivreNesseProcessoAbaixoDaPatenteAtual() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => this.registrosGanhosLivresRealizados.some(ganhoLivre => ganhoLivre.pericia?.id === pericia.id && ganhoLivre.patente !== null && ganhoLivre.patente.id <= patenteAtual.id); }
    //
    // #endregion

    // #region Verificação Gerais
    //

    // logica de verificação geral de alteração positiva por perícia livre para essa patente nesse processo
    get obtemSeEssaPatenteFoiGanhadaPorPericiaLivreNesseProcesso() { return (): boolean => true; }
    //

    // logica geral de ganho comum
    get obtemSeTemPontoGanhoDisponivel() { return this.registrosGanhosDisponiveis.length > 0 || this.registrosGanhosLivresDisponiveis.length > 0; }
    get obtemSeTemPontoGanhoDisponivelParaPatente() { return (patente: PatentePericiaDto) => this.registrosGanhosDisponiveis.filter(ganho => ganho.patente.id === patente.id).length; }
    get obtemNumeroPontosGanhoParaPatente() { return (patente: PatentePericiaDto): number => this.pontosDeGanho.filter(ganho => ganho.patente.id === patente.id).length; }
    //

    // logica geral de ganho livre
    get obtemSeTemPontoGanhoLivreDisponivel() { return this.registrosGanhosLivresDisponiveis.length > 0; }
    get obtemSePatenteAtualPericiaFoiEvoluidaPorGanhoDePericiaLivre() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => false; }
    //

    // logica geral de troca comum
    get obtemSeTemPontoTrocaEmAndamento() { return this.registrosTrocasApenasPerderam.length > 0 || this.registrosTrocasLivresApenasPerderam.length > 0; }
    get obtemNumeroDeTrocasDisponiveisParaPatente() { return (patente: PatentePericiaDto): number => this.registrosTrocasDisponiveis.filter(troca => troca.patente.id === patente.id).length; }
    get obtemNumeroTrocasGanhoParaPatente() { return (patente: PatentePericiaDto): number => this.pontosDeTroca.filter(troca => troca.patente.id === patente.id).length; }
    //

    // logica geral de troca livre
    get obtemSePatenteAtualPericiaFoiEvoluidaPorTrocaDePericiaLivre() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => false; }
    //


    // logica generica
    get obtemSePatenteAtualPericiaFoiEvoluidaPorPericiaLivre() { return (pericia: PericiaDto, patenteAtual: PatentePericiaDto): boolean => this.obtemSePatenteAtualPericiaFoiEvoluidaPorGanhoDePericiaLivre(pericia, patenteAtual) || this.obtemSePatenteAtualPericiaFoiEvoluidaPorTrocaDePericiaLivre(pericia, patenteAtual); }
    //

    //
    // #endregion

    // #region Metodos Botões
    //
    subtraiPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto, executaAlteracoes: boolean = true): boolean {
        if (!this.patenteEstaAcimaPatenteMinima(patenteAtual)) return false;
        if (this.obtemSeEssaPatentePericiaEhDevidoPericiaLivre(pericia, patenteAtual)) return false;

        // prioridade 1.1 para remover trocas livres que adicionaram nessa perícia
        const idRegistroEvolucaoPorTrocaLivre = this.obtemIdDoRegistroTrocaLivreQueGanhouEssaPatentePericia(pericia, patenteAtual, false);
        if (idRegistroEvolucaoPorTrocaLivre !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto livre, revertendo ganho por troca`);
                const registroRemovendo = this.pontosDeTrocaLivre.find(troca => troca.id === idRegistroEvolucaoPorTrocaLivre)!;

                registroRemovendo.periciaGanhou = null;
                registroRemovendo.patenteGanhou = null;

                registroRemovendo.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 1.2 para remover trocas que adicionaram nessa perícia
        const idRegistroEvolucaoPorTroca = this.obtemIdDoRegistroTrocaQueGanhouEssaPatentePericia(pericia, patenteAtual);
        if (idRegistroEvolucaoPorTroca !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto comum, revertendo ganho por troca`);
                const registroRemovendo = this.pontosDeTroca.find(troca => troca.id === idRegistroEvolucaoPorTroca)!;

                registroRemovendo.periciaGanhou = null;

                registroRemovendo.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 2 para remover ganhos que adicionaram nessa perícia
        const idRegitrosEvolucaoPorGanho = this.obtemIdDoRegistroGanhoQueGanhouEssaPatentePericia(pericia, patenteAtual);
        if (idRegitrosEvolucaoPorGanho !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto comum, revertendo ganho por ganho`);
                const registroRemovendo = this.pontosDeGanho.find(troca => troca.id === idRegitrosEvolucaoPorGanho)!;

                registroRemovendo.pericia = null;

                registroRemovendo.ordenacao = null;
            }

            return true;
        }

        // pericia Ocultismo não pode ser removido, ent bloqueia caso não seja retrocesso de procedimento
        if (pericia.id === 16) return false;

        // prioridade 3.1 para remover ponto que será trocado
        const idRegistroIniciaTroca = this.obtemIdDoRegistroTrocaQuePodeRealizarRetiradaPatente(patenteAtual);
        if (idRegistroIniciaTroca !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto comum, retirando para trocar`);
                const registroRemovendo = this.pontosDeTroca.find(troca => troca.id === idRegistroIniciaTroca)!;

                registroRemovendo.periciaPerdeu = pericia;

                registroRemovendo.ordenacaoPerda = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 3.2 para remover ponto que será trocado com troca livre
        const idRegistroIniciaTrocaLivre = this.obtemIdDoRegistroTrocaLivreQuePodeRetirarPatente();
        if (idRegistroIniciaTrocaLivre !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto livre, retirando para trocar`);
                const registroRemovendo = this.pontosDeTrocaLivre.find(troca => troca.id === idRegistroIniciaTrocaLivre)!;

                registroRemovendo.periciaPerdeu = pericia;
                registroRemovendo.patentePerdeu = patenteAtual;
                registroRemovendo.ganhaPerdeMesmaPatente = true;

                registroRemovendo.ordenacaoPerda = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        return false;
    }

    adicionaPonto(pericia: PericiaDto, patenteAtual: PatentePericiaDto, executaAlteracoes: boolean = true): boolean {
        if (!this.patenteEstaAbaixoPatenteMaxima(patenteAtual)) return false;

        // prioridade 0.1 para desfazer uma remoção de troca livre em uma pericia pela mesma patente retirada
        const idRegistroLivreDesfezTrocaEquivalente = this.obtemIdDoRegistroTrocaLivreTirouPatenteParaGanharDenovo(pericia, patenteAtual);
        if (idRegistroLivreDesfezTrocaEquivalente !== null) {
            if (executaAlteracoes) {
                // console.log(`caso especial! adicionando ponto livre, desfazendo troca pela mesma patente`);
                const registroGanhando = this.pontosDeTrocaLivre.find(troca => troca.id === idRegistroLivreDesfezTrocaEquivalente)!;

                registroGanhando.periciaGanhou = pericia;
                registroGanhando.patenteGanhou = GanhosEvolucao.dadosReferencia.patentes.find(patenteReferencia => patenteReferencia.id === (patenteAtual.id + 1))!;
                registroGanhando.ordenacaoGanho = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 0.2 para desfazer uma remoção de troca em uma pericia pela mesma patente retirada
        const idRegistroDesfezTrocaEquivalente = this.obtemIdDoRegistroTrocaTirouPatenteParaGanharDenovo(pericia, patenteAtual);
        if (idRegistroDesfezTrocaEquivalente !== null) {
            if (executaAlteracoes) {
                // console.log(`caso especial! adicionando ponto comum, desfazendo troca pela mesma patente`);
                const registroGanhando = this.pontosDeTroca.find(troca => troca.id === idRegistroDesfezTrocaEquivalente)!;

                registroGanhando.periciaGanhou = pericia;

                registroGanhando.ordenacaoGanho = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 1.1 para desfazer uma remoção de troca livre
        const idRegistroDesfazTrocaLivre = this.obtemIdDoRegistroTrocaLivreParaReveter(pericia, patenteAtual, false);
        if (idRegistroDesfazTrocaLivre !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto comum, desfazendo troca livre`);
                const registroGanhando = this.pontosDeTrocaLivre.find(troca => troca.id === idRegistroDesfazTrocaLivre)!;

                registroGanhando.periciaPerdeu = null;
                registroGanhando.periciaGanhou = null;
                registroGanhando.ganhaPerdeMesmaPatente = null;

                registroGanhando.ordenacaoPerda = null;
                registroGanhando.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 1.2 para desfazer uma remoção de troca
        const idRegistroDesfazTroca = this.obtemIdDoRegistroTrocaParaReveter(pericia, patenteAtual);
        if (idRegistroDesfazTroca !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto comum, desfazendo troca`);
                const registroGanhando = this.pontosDeTroca.find(troca => troca.id === idRegistroDesfazTroca)!;

                registroGanhando.periciaPerdeu = null;
                registroGanhando.periciaGanhou = null;

                registroGanhando.ordenacaoPerda = null;
                registroGanhando.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 2.1 para completar trocas que já foram feitas (vem antes da livre para reforçar a ordem de prioridade - livre é o ultimo recurso)
        const idRegistroFinalizarTroca = this.obtemIdDoRegistroTrocaQuePodeRealizarGanhoDessaPatente(patenteAtual);
        if (idRegistroFinalizarTroca !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto comum, finalizando troca`);
                const registroGanhando = this.pontosDeTroca.find(troca => troca.id === idRegistroFinalizarTroca)!;

                registroGanhando.periciaGanhou = pericia;

                registroGanhando.ordenacaoGanho = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 2.2 para completar trocas livres que já foram feitas
        const idRegistroFinalizarTrocaLivre = this.obtemIdDoRegistroTrocaLivreQuePodeRealizarGanho(patenteAtual, false);
        if (idRegistroFinalizarTrocaLivre !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto livre, finalizando troca`);
                const registroGanhando = this.pontosDeTrocaLivre.find(troca => troca.id === idRegistroFinalizarTrocaLivre)!;

                registroGanhando.periciaGanhou = pericia;
                registroGanhando.patenteGanhou = GanhosEvolucao.dadosReferencia.patentes.find(patenteReferencia => patenteReferencia.id === (patenteAtual.id + 1))!;

                registroGanhando.ordenacaoGanho = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 3 para ganho normal de patente comum
        const idRegistroGanhoPatente = this.obtemIdDoRegistroGanhoQuePodeRealizarGanhoDessaPatente(patenteAtual);
        if (idRegistroGanhoPatente !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto comum, ganho`);
                const registroGanhando = this.pontosDeGanho.find(ganho => ganho.id === idRegistroGanhoPatente)!;

                registroGanhando.pericia = pericia;

                registroGanhando.ordenacao = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        return false;
    }

    subtraiPontoLivre(pericia: PericiaDto, patenteAtual: PatentePericiaDto, executaAlteracoes: boolean = true): boolean {
        if (!this.patenteEstaAcimaPatenteMinima(patenteAtual)) return false;

        // prioridade 1 para desfazer ganho de troca
        const idRegistroTrocaGanha = this.obtemIdDoRegistroTrocaLivreQueGanhouEssaPatentePericia(pericia, patenteAtual, true);
        if (idRegistroTrocaGanha !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto livre, revertendo ganho por troca`);
                const registroRemovendo = this.pontosDeTrocaLivre.find(trocaLivre => trocaLivre.id === idRegistroTrocaGanha)!;

                registroRemovendo.periciaGanhou = null;
                registroRemovendo.patenteGanhou = null;
                registroRemovendo.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 2 para remover ganho de procedimento previo nessa perícia
        const indexRegistoPrevio = this.registrosPreviosPericiaLivre.findIndex(registro => registro.idPericia === pericia.id && registro.idPatente === patenteAtual.id);
        if (indexRegistoPrevio >= 0) {
            const idRegitroTrocaLivre = this.obtemIdDoRegistroTrocaLivreQuePodeRetirarPatente();
            if (idRegitroTrocaLivre !== null) {
                if (executaAlteracoes) {
                    // console.log(`subtraindo ponto livre, iniciando troca de Perícia Livre`);
                    const registroRemovendo = this.pontosDeTrocaLivre.find(trocaLivre => trocaLivre.id === idRegitroTrocaLivre)!;

                    registroRemovendo.periciaPerdeu = pericia;
                    registroRemovendo.patentePerdeu = patenteAtual;
                    registroRemovendo.indexRegistroPericiaLivre = indexRegistoPrevio;
                    registroRemovendo.ordenacaoPerda = GanhosEvolucao.obtemOrdenacaoAtual();
                }

                return true;
            }
        }

        // prioridade 3 para remover ganhos que adicionaram nessa perícia
        const idRegitroEvolucaoPorGanho = this.obtemIdDoRegistroGanhoLivreQueGanhouEssaPatentePericia(pericia, patenteAtual);
        if (idRegitroEvolucaoPorGanho !== null) {
            if (executaAlteracoes) {
                // console.log(`subtraindo ponto livre, revertendo ganho por ganho livre`);
                const registroRemovendo = this.pontosDeGanhoLivre.find(troca => troca.id === idRegitroEvolucaoPorGanho)!;

                registroRemovendo.pericia = null;
                registroRemovendo.patente = null;
                registroRemovendo.ordenacao = null;
            }

            return true;
        }

        // pericia Ocultismo não pode ser removido, ent bloqueia caso não seja retrocesso de procedimento
        if (pericia.id === 16) return false;

        return false;
    }

    adicionaPontoLivre(pericia: PericiaDto, patenteAtual: PatentePericiaDto, executaAlteracoes: boolean = true): boolean {
        if (!this.patenteEstaAbaixoPatenteMaxima(patenteAtual)) return false;

        // prioridade 1 para refazer perda de troca
        const idRegistroTrocaEmAndamento = this.obtemIdDoRegistroTrocaLivreParaReveter(pericia, patenteAtual, true);
        if (idRegistroTrocaEmAndamento !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto livre, revertendo troca`);
                const registroGanhando = this.pontosDeTrocaLivre.find(trocaLivre => trocaLivre.id === idRegistroTrocaEmAndamento)!;

                registroGanhando.periciaPerdeu = null;
                registroGanhando.patentePerdeu = null;
                registroGanhando.indexRegistroPericiaLivre = null;
                registroGanhando.ordenacaoPerda = null;

                registroGanhando.periciaGanhou = null;
                registroGanhando.patenteGanhou = null;
                registroGanhando.ordenacaoGanho = null;
            }

            return true;
        }

        // prioridade 2 para completar troca
        const idRegistroTrocaParaGanhar = this.obtemIdDoRegistroTrocaLivreQuePodeRealizarGanho(patenteAtual, true);
        if (idRegistroTrocaParaGanhar !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto livre, ganhando troca`);
                const registroGanhando = this.pontosDeTrocaLivre.find(trocaLivre => trocaLivre.id === idRegistroTrocaParaGanhar)!;

                registroGanhando.periciaGanhou = pericia;
                registroGanhando.patenteGanhou = GanhosEvolucao.dadosReferencia.patentes.find(patenteReferencia => patenteReferencia.id === (patenteAtual.id + 1))!;;
                registroGanhando.ordenacaoGanho = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        // prioridade 3 para ganho de pericia livre
        const idRegistroGanhoLivre = this.obtemIdDoRegistroGanhoLivreQuePodeRealizarGanho();
        if (idRegistroGanhoLivre !== null) {
            if (executaAlteracoes) {
                // console.log(`adicionando ponto livre, ganho`);
                const registroGanhando = this.pontosDeGanhoLivre.find(ganhoLivre => ganhoLivre.id === idRegistroGanhoLivre)!;

                registroGanhando.pericia = pericia;
                registroGanhando.patente = GanhosEvolucao.dadosReferencia.patentes.find(patenteReferencia => patenteReferencia.id === (patenteAtual.id + 1))!;
                registroGanhando.ordenacao = GanhosEvolucao.obtemOrdenacaoAtual();
            }

            return true;
        }

        return false;
    }
    //
    // #endregion
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

export class EtapaGanhoEvolucao_HabilidadesParanormais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Habilidades Paranormais';
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
    public tituloEtapa = 'Limite de Habilidades Elementais';
    public hrefDefinicaoEtapa = '/definicoes/HabilidadesEspeciais';
    public quantidadeDePontosAumento: number = 0;
    get quantidadeDePontosNova(): number { return this.quantidadeDePontosAtual + this.quantidadeDePontosAumento; }

    public listaDadosGanho: DadosGanho_PontosHabilidadeElemental[];
    public dadosGanhoAgrupados: DadosGanho_PontosHabilidadeElemental;

    agrupaDadosDessaEtapa = (): DadosGanho_PontosHabilidadeElemental => {
        return this.listaDadosGanho.reduce((acc, cur) => ({
            valorAumento: acc.valorAumento + cur.valorAumento,
        }), { valorAumento: 0 });
    }

    constructor(listaDadosGanho: DadosGanho_PontosHabilidadeElemental[], public quantidadeDePontosAtual: number) {
        super();

        this.listaDadosGanho = listaDadosGanho;
        this.dadosGanhoAgrupados = this.agrupaDadosDessaEtapa();

        this.quantidadeDePontosAumento = this.dadosGanhoAgrupados.valorAumento;
    }

    get finalizado(): boolean { return true; }

    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] {
        return [
            { mensagem: `Limite na quantidade de Habilidade Elemental aumentados`, icone: '' },
            { mensagem: `De ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova} ${pluralize(this.quantidadeDePontosNova, 'Ponto')}`, icone: '', tipo: 'subitem' },
        ];
    }

    public get detalhesEvolucaoEtapa(): string[] { return [`Limite na quantidade de Habilidade Elemental aumentados de ${this.quantidadeDePontosAtual} para ${this.quantidadeDePontosNova}`]; }
}

type AvisoGanhoEvolucao = {
    mensagem: string,
    icone: ReactNode,
    tipo?: 'subitem',
}


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
    const [carregando, setCarregando] = useState<string | null>('');
    const { personagemSelecionado } = useContextoPaginaPersonagens();
    const { navegarPara } = useContextoPaginaPersonagem();
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
            navegarPara(PAGINA_PERSONAGEM.INICIAL);
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
                recuperaGanhosAposSelecaoClasse,
                { atributos: ganhos.listaReferenciaTodosAtributos, pericias: ganhos.listaReferenciaPericiasDisponiveis, patentes: ganhos.listaReferenciaTodasPatentes, estatisticasDanificaveis: ganhos.listaReferenciaTodasEstatisticasDanificaveis, classes: ganhos.listaReferenciaTodasClasses, tiposGanho: ganhos.listaReferenciaTodosTiposGanho },
                ganhos.listaGanhos,
                ganhos.listaGanhosEstatisticasPorAtributos
            ));
        }
    }

    async function salvarEvolucao(fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo): Promise<boolean> {
        setCarregando('Salvando Edições do Personagem');

        try {
            return salvarEvolucaoDoPersonagem(fichaEvoluida, fichaDeJogoEvoluida);
        } catch {
            return false;
        }
    }

    useEffect(() => {
        setPersonagemEmEdicao(personagemSelecionado);
    }, []);

    useEffect(() => {
        carregaGanhos();
    }, [personagemEmEdicao]);

    if (carregando) return <h2>{carregando}</h2>

    if (!personagemEmEdicao) return;

    if (!paginaAberta) return;

    if (ganhos === null) return;

    return (
        <ContextoEdicaoFicha.Provider value={{ registraEventoAtualizacaoPagina, executaEAtualiza, personagemEmEdicao, paginaAberta, ganhos }}>
            {children}
        </ContextoEdicaoFicha.Provider>
    );
};
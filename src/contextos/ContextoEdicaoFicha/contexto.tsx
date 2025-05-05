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
import { AtributoDto, AtributoFichaDto, DadosGanho_Atributos, DetalheFichaDto, GanhoEstatisticaAtributoClasseDto, GanhoNivelClasseDto, PersonagemDto } from 'types-nora-api';
import { pluralize } from 'Uteis/UteisTexto/pluralize';

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
import React from 'react';

class GanhosEvolucao {
    public ganhos: EtapaGanhoEvolucao[];
    public ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[];
    public estaAbertoResumoInicial: boolean;
    public estaAbertoResumoFinal: boolean;
    public indexEtapaEmAndamento: number = 0;

    constructor(
        public refPersonagem: PersonagemDto,
        ganhosEmJson: GanhoNivelClasseDto[],
        ganhosEstatisticasPorAtributo: GanhoEstatisticaAtributoClasseDto[]
    ) {
        this.ganhos = GanhosEvolucao.formataGanhos(ganhosEmJson, refPersonagem.fichaVigente!.detalhe);
        this.ganhosEstatisticasPorAtributo = ganhosEstatisticasPorAtributo;
        this.estaAbertoResumoInicial = true;
        this.estaAbertoResumoFinal = false;
    }
    
    get estaEmPaginaDeResumo(): boolean { return this.estaAbertoResumoInicial || this.estaAbertoResumoFinal; }
    get podeAvancarEtapa(): boolean { return this.estaEmPaginaDeResumo || (this.etapaAtual !== null && this.etapaAtual.finalizado); }
    // get podeAvancarEtapa(): boolean { return this.etapa.finalizado && this.etapa.pontosObrigatoriosValidadosGenerico; }

    avancaEtapa() {
        if (this.estaAbertoResumoInicial)
            this.estaAbertoResumoInicial = false;
        else if (this.estaAbertoResumoFinal)
            this.implementarSalvar();
        else if (this.estaNaUltimaEtapa)
            this.estaAbertoResumoFinal = true;
        else
            this.indexEtapaEmAndamento++;
    }



    implementarSalvar() { }

    get estaNaUltimaEtapa(): boolean { return this.indexEtapaEmAndamento === this.ganhos.length - 1; }
    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapaEmAndamento === 0; }
    get etapaAtual(): EtapaGanhoEvolucao | null { return  this.ganhos[this.indexEtapaEmAndamento]; }

    get textoBotaoProximo(): string { return this.estaAbertoResumoInicial ? 'Começar' : this.estaAbertoResumoFinal ? 'Finalizar' : 'Continuar'; }
    get textoBotaoVoltar(): string { return this.estaAbertoResumoInicial ? 'Sair' : 'Voltar'; }

    get tituloNexUp(): string {
        if (this.refPersonagem.fichaPendente?.nivel.id === 1) return `${this.refPersonagem.informacao.nome} - Criando Ficha`;

        if (!(this.etapaAtual instanceof EtapaGanhoEvolucao_Atributos)) {
            // const ganhoClasse = this.etapa as GanhoIndividualNexEscolhaClasse;
            return `Selecionando Classe: necessario implementar variavel ganhoClasse`;
        }

        return `Evoluindo Ficha - ${this.refPersonagem.fichaPendente?.nivel.nomeVisualizacao}`;
    }

    get atributosEditados(): AtributoFichaDto[] {
        const etapaAtributos = this.ganhos.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos);

        return this.refPersonagem.fichaVigente?.atributos.map(atributoFicha => ({
            ...atributoFicha,
            valor:
                atributoFicha.valor
                + (etapaAtributos?.pontosDeGanho.filter(atributoEmGanho => atributoEmGanho?.id === atributoFicha.atributo.id).length ?? 0)
                + (etapaAtributos?.pontosDeTroca.filter(troca => troca.atributoGanhou?.id === atributoFicha.atributo.id).length ?? 0)
                - (etapaAtributos?.pontosDeTroca.filter(troca => troca.atributoPerdeu?.id === atributoFicha.atributo.id).length ?? 0)
        })) ?? [];
    }

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
    }

    static formataGanhos(ganhosEmJson: GanhoNivelClasseDto[], detalhesFicha: DetalheFichaDto): EtapaGanhoEvolucao[] {
        const retorno: EtapaGanhoEvolucao[] = [];
        console.log(`ganhosEmJson`);
        console.log(ganhosEmJson);

        ganhosEmJson.sort((a, b) => a.tipoGanhoNivel.ordem - b.tipoGanhoNivel.ordem).map(ganho => {
            switch (ganho.tipoGanhoNivel.id) {
                case 1:
                    // Alterações de Atributos
                    retorno.push(new EtapaGanhoEvolucao_Atributos((ganho.dados as DadosGanho_Atributos), detalhesFicha.dados.valorMaxAtributo));
                    break;
                case 2:
                    // Alterações de Perícias
                    retorno.push(new EtapaGanhoEvolucao_Pericias());
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
    }
}

abstract class EtapaGanhoEvolucao {
    public abstract tituloEtapa: string;
    public abstract get avisosGanhoEvolucao(): AvisoGanhoEvolucao[];
    public abstract get finalizado(): boolean;
}

export class EtapaGanhoEvolucao_Classes extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Classes';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }
}

export class EtapaGanhoEvolucao_ValorMaxAtributo extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Valor Máximo de Atributo';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }
}

export class EtapaGanhoEvolucao_Estatisticas extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Estatísticas';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }
}

export class EtapaGanhoEvolucao_HabilidadesEspeciais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Habilidade Especial';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }
}

export class EtapaGanhoEvolucao_Atributos extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Atributos';
    public pontosDeGanho: (AtributoDto | null)[];
    public pontosDeTroca: ({ atributoPerdeu: AtributoDto | null, atributoGanhou: AtributoDto | null })[];
    public valorMaxAtributo: number;
    public valorMinAtributo: number = 0;

    constructor(dadosGanho_Atributos: DadosGanho_Atributos, valorMaxAtributo: number) {
        super();
        this.pontosDeGanho = Array.from({ length: dadosGanho_Atributos.ganhos }, () => null);
        this.pontosDeTroca = Array.from({ length: dadosGanho_Atributos.trocas }, () => ({ atributoPerdeu: null, atributoGanhou: null }));
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
                            this.pontosDeGanho.map(atributo => {
                                return atributo
                                    ? {
                                        mensagem: `Ganhando 1 de ${atributo.nome}`,
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

            // { mensagem: `Ganho de P.V.: +2`, icone: '' },
            // { mensagem: `Ganho de P.S.: +3`, icone: '' },
            // { mensagem: `Ganho de P.E.: +4`, icone: '' },
        ];
    };

    get finalizado(): boolean { return !this.temPontoGanhoLivre && this.obtemNumeroPontosTrocaEmAndamento === 0; }

    // #region Logica de Pontos de Ganho
    // / Simplesmente soma no valor do Atributo
    // / Obrigatório gastar todos os pontos recebidos
    //
    get obtemNumeroPontosGanho(): number { return this.pontosDeGanho.length; }
    get obtemNumeroPontosGanhoLivres(): number { return (this.pontosDeGanho.filter(ponto => ponto === null) || []).length; }
    get pontoGanhoLivre() { return this.pontosDeGanho.findIndex(ponto => ponto === null); }
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
    get obtemNumeroPontosTrocaLivres(): number { return (this.pontosDeTroca.filter(ponto => !ponto.atributoPerdeu) || []).length; }
    get obtemNumeroPontosTrocaEmAndamento(): number { return (this.pontosDeTroca.filter(ponto => ponto.atributoPerdeu && !ponto.atributoGanhou) || []).length; }

    get pontoTrocaRetiraLivre() { return this.pontosDeTroca.findIndex(ponto => !ponto.atributoPerdeu); }
    get pontoTrocaGanhaLivre() { return this.pontosDeTroca.findIndex(ponto => ponto.atributoPerdeu && !ponto.atributoGanhou); }

    get temPontoTrocaRetiraLivre(): boolean { return this.pontoTrocaRetiraLivre >= 0; }
    get temPontoTrocaGanhaLivre(): boolean { return this.pontoTrocaGanhaLivre >= 0; }
    //
    // #endregion

    // #region Validação Botões
    //
    atributoTemPontoAdicionadoEmGanho(idAtributo: number): boolean { return this.pontosDeGanho.some(atributoEmGanho => atributoEmGanho?.id === idAtributo); }

    atributoTemPontoRemovidoEmTroca(idAtributo: number): boolean { return this.pontosDeTroca.some(ponto => ponto.atributoPerdeu?.id === idAtributo); }
    atributoTemPontoAdicionadoEmTroca(idAtributo: number): boolean { return this.pontosDeTroca.some(ponto => ponto.atributoGanhou?.id === idAtributo); }

    botaoAdicionarEstaHabilitado(atributoFicha: AtributoFichaDto) { return (atributoFicha.valor < this.valorMaxAtributo && (this.temPontoGanhoLivre || this.temPontoTrocaGanhaLivre)); }
    botaoRemoverEstaHabilitado(atributoFicha: AtributoFichaDto) { return (atributoFicha.valor > this.valorMinAtributo && (this.temPontoTrocaRetiraLivre || this.atributoTemPontoAdicionadoEmGanho(atributoFicha.atributo.id) || this.atributoTemPontoAdicionadoEmTroca(atributoFicha.atributo.id))); }
    //
    // #endregion

    // #region Metodos Botões
    //
    adicionaPonto(atributo: AtributoDto) {
        // prioridade 1 para desfazer uma remoção de troca
        if (this.atributoTemPontoRemovidoEmTroca(atributo.id)) {
            this.pontosDeTroca[this.pontosDeTroca.findIndex(ponto => ponto.atributoPerdeu?.id === atributo.id)].atributoGanhou = null;
            this.pontosDeTroca[this.pontosDeTroca.findIndex(ponto => ponto.atributoPerdeu?.id === atributo.id)].atributoPerdeu = null;
        }

        // prioridade 2 para completar trocas que já foram feitas
        else if (this.temPontoTrocaGanhaLivre) this.pontosDeTroca[this.pontosDeTroca.findIndex(ponto => ponto.atributoPerdeu && !ponto.atributoGanhou)]!.atributoGanhou = atributo;

        // ganho normal
        else if (this.temPontoGanhoLivre) this.pontosDeGanho[this.pontoGanhoLivre] = atributo;
    }

    subtraiPonto(atributo: AtributoDto) {
        // prioridade 1 para remover trocas que adicionaram nesse atributo
        if (this.atributoTemPontoAdicionadoEmTroca(atributo.id)) this.pontosDeTroca[this.pontosDeTroca.findIndex(ponto => ponto.atributoGanhou?.id === atributo.id)].atributoGanhou = null;

        // prioridade 2 para remover ganhos que adicionaram nesse atributo
        else if (this.atributoTemPontoAdicionadoEmGanho(atributo.id)) this.pontosDeGanho[this.pontosDeGanho.findIndex(atributoEmGanho => atributoEmGanho?.id === atributo.id)] = null;

        // remover ponto que será trocado
        else if (this.temPontoTrocaRetiraLivre) this.pontosDeTroca[this.pontoTrocaRetiraLivre]!.atributoPerdeu = atributo;
    }
    //
    // #endregion
}

export class EtapaGanhoEvolucao_Pericias extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Perícias';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return false; }
}

export class EtapaGanhoEvolucao_MelhoriasRituais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Pontos de Melhoria de Ritual';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }
}

export class EtapaGanhoEvolucao_Rituais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Rituais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }
}

export class EtapaGanhoEvolucao_HabilidadesParanormais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Paranormais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }
}

export class EtapaGanhoEvolucao_HabilidadesElementais extends EtapaGanhoEvolucao {
    public tituloEtapa = 'Habilidades Elementais';
    public get avisosGanhoEvolucao(): AvisoGanhoEvolucao[] { return []; }
    get finalizado(): boolean { return true; }
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
            setGanhos(new GanhosEvolucao(personagemEmEdicao, ganhos.listaGanhos, ganhos.listaGanhosEstatisticasPorAtributos));
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
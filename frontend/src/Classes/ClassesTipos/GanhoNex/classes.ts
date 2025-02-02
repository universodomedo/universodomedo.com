// #region Imports
import React from 'react';
import { RLJ_Ficha2, Atributo, Pericia, PatentePericia, ArgsRitual, AvisoGanhoNex, ValidacoesGanhoNex, RegrasCondicaoGanhoNex, OperadorCondicao, CondicaoGanhoNex, TipoEstatisticaDanificavel, pluralize, PropsHabilidades, Personagem, Classe } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
// #endregion

// #region Classes
export class GanhosNex {
    public ganhos: GanhoIndividualNex[] = [];
    public indexEtapa: number = 0;
    public idNexEmAndamento: number = 0;

    constructor(public personagem: Personagem, private indexFicha: number) {
        this.atualizarGanhosDesseNex();
    }

    atualizarGanhosDesseNex() {
        GanhoIndividualNexFactory.setFicha(this.personagem.dadosFicha);
        this.idNexEmAndamento = this.personagem.dadosFicha.detalhes.idNivel + 1;
        this.indexEtapa = 0;
        this.ganhos = obterGanhosGerais(this.idNexEmAndamento, this.personagem.dadosFicha.detalhes.idClasse);
    }

    get finalizados(): boolean { return false; }

    finalizar() { console.log('nex finalizado'); }

    clickBotao() {

    }

    get tituloNexUp(): string {
        if (this.idNexEmAndamento === 1) return 'Criando Ficha';

        if (this.etapa instanceof GanhoIndividualNexEscolhaClasse) {
            const ganhoClasse = this.etapa as GanhoIndividualNexEscolhaClasse;
            return `Selecionando Classe: ${ganhoClasse.refClasseEscolhida?.nome}`;
        }

        return `Evoluindo Ficha - NEX ${SingletonHelper.getInstance().niveis.find(nivel => nivel.id === this.idNexEmAndamento)?.nomeDisplay}`;
    }

    get pv(): { valorAtual: number, ganhoAtual: number, valorAtualizado: number } {
        const valorAtual = this.personagem.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 1)?.valor || 0;
        const ganhoAtual = this.ganhos.reduce((acc, cur) => acc + cur.pvGanhoIndividual, 0);
        const valorAtualizado = valorAtual + ganhoAtual;

        return { valorAtual, ganhoAtual, valorAtualizado };
    }

    get ps(): { valorAtual: number, ganhoAtual: number, valorAtualizado: number } {
        const valorAtual = this.personagem.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 2)?.valor || 0;
        const ganhoAtual = this.ganhos.reduce((acc, cur) => acc + cur.psGanhoIndividual, 0);
        const valorAtualizado = valorAtual + ganhoAtual;

        return { valorAtual, ganhoAtual, valorAtualizado };
    }

    get pe(): { valorAtual: number, ganhoAtual: number, valorAtualizado: number } {
        const valorAtual = this.personagem.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 3)?.valor || 0;
        const ganhoAtual = this.ganhos.reduce((acc, cur) => acc + cur.peGanhoIndividual, 0);
        const valorAtualizado = valorAtual + ganhoAtual;

        return { valorAtual, ganhoAtual, valorAtualizado };
    }

    get ganhosQueTemAlteracao(): GanhoIndividualNex[] { return this.ganhos.filter(ganho => ganho.alterando); }
    get etapa(): GanhoIndividualNex { return this.ganhosQueTemAlteracao[this.indexEtapa]; }

    get estaNaUltimaEtapa(): boolean { return this.indexEtapa === this.ganhosQueTemAlteracao.length - 1; }
    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapa === 0; }
    get textoBotaoProximo(): string { return this.estaNaUltimaEtapa ? 'Finalizar' : 'Continuar'; }
    get textoBotaoVoltar(): string { return this.estaNaPrimeiraEtapa ? 'Sair' : 'Voltar'; }

    avancaEtapa() {
        if (this.etapa instanceof GanhoIndividualNexEscolhaClasse) {
            this.escreveNovosDadosDaEtapa();
            this.etapa.validaCondicoes();
            return;
        }

        this.escreveNovosDadosDaEtapa();

        if (!this.estaNaUltimaEtapa) {
            this.indexEtapa++;
            this.etapa.validaCondicoes();
            // this.etapa.pontosObrigatoriosValidadosGenerico;
        } else {
            this.salvaModificacoes();
        }
    }

    escreveNovosDadosDaEtapa() {
        if (this.etapa instanceof GanhoIndividualNexEscolhaClasse) {
            this.personagem.dadosFicha.detalhes.idClasse = (this.etapa as GanhoIndividualNexEscolhaClasse).idOpcaoEscolhida!;
            this.atualizarGanhosDesseNex();
            return;
        }

        if (this.etapa instanceof GanhoIndividualNexHabilidade) {
            this.personagem.dadosFicha.habilidadesEspeciais = this.etapa.dadosHabilidades;
        }

        if (this.etapa instanceof GanhoIndividualNexAtributo) {
            this.personagem.dadosFicha.atributos = this.etapa.atributos.map(atributo => ({ id: atributo.refAtributo.id, valor: atributo.valorAtual }));
            this.personagem.dadosFicha.estatisticasDanificaveis = this.personagem.dadosFicha.estatisticasDanificaveis!.map(estatistica => {
                switch (estatistica.id) {
                    case 1:
                        estatistica.valorMaximo += this.etapa.pvGanhoIndividual;
                        estatistica.valor = estatistica.valorMaximo;
                        break;
                    case 2:
                        estatistica.valorMaximo += this.etapa.psGanhoIndividual;
                        break;
                    case 3:
                        estatistica.valorMaximo += this.etapa.peGanhoIndividual;
                        break;
                    default:
                        break;
                }

                estatistica.valor = estatistica.valorMaximo;
                return estatistica;
            });

            this.personagem.carregaAtributos();
        }

        if (this.etapa instanceof GanhoIndividualNexEstatisticaFixa) {
            this.personagem.dadosFicha.estatisticasDanificaveis = this.personagem.dadosFicha.estatisticasDanificaveis!.map(estatistica => {
                switch (estatistica.id) {
                    case 1:
                        estatistica.valorMaximo += this.etapa.pvGanhoIndividual;
                        break;
                    case 2:
                        estatistica.valorMaximo += this.etapa.psGanhoIndividual;
                        break;
                    case 3:
                        estatistica.valorMaximo += this.etapa.peGanhoIndividual;
                        break;
                    default:
                        break;
                }

                estatistica.valor = estatistica.valorMaximo;
                return estatistica;
            });
        }

        if (this.etapa instanceof GanhoIndividualNexPericia) {
            this.personagem.dadosFicha.periciasPatentes = this.etapa.pericias.map(pericia => ({ idPericia: pericia.refPericia.id, idPatente: pericia.refPatenteAtual.id }));
            this.personagem.carregaPericias();
        }

        if (this.etapa instanceof GanhoIndividualNexRitual) {
            this.personagem.dadosFicha.rituais = this.etapa.dadosRituais.map(ritual => ritual.dadosRitual);
            this.personagem.carregaRituais();
        }
    }

    salvaModificacoes() {
        this.personagem.dadosFicha.detalhes.idNivel = this.idNexEmAndamento;

        const data = localStorage.getItem('dadosFicha');
        const dadosFichas = data ? JSON.parse(data) : [];

        dadosFichas[this.indexFicha] = this.personagem.dadosFicha;
        localStorage.setItem('dadosFicha', JSON.stringify(dadosFichas));

        if (this.idNexEmAndamento < this.personagem.dadosFicha.pendencias.idNivelEsperado) {
            this.atualizarGanhosDesseNex();
        } else {
            window.location.reload();
        }
    }

    get podeAvancarEtapa(): boolean { return this.etapa.finalizado && this.etapa.pontosObrigatoriosValidadosGenerico; }
}

export abstract class GanhoIndividualNex {
    protected _refFicha: RLJ_Ficha2;

    constructor(
        protected _alterando: boolean,
    ) {
        this._refFicha = GanhoIndividualNexFactory.ficha;
    }

    public abstract tituloEtapa: string;
    public abstract get avisoGanhoNex(): AvisoGanhoNex[];
    public pontosObrigatorios: ValidacoesGanhoNex[] = [];

    public get pontosObrigatoriosValidadosGenerico(): boolean {
        this.validaCondicoes();

        return this.pontosObrigatorios.every(pontoObrigatorio => pontoObrigatorio.valido);
    }

    public validaCondicoes(): void {
        this.pontosObrigatorios.forEach(pontoObrigatorio => {
            pontoObrigatorio.condicao.condicoes.forEach(condicao => condicao.validaCondicao(this.obtemOpcaoAValidar(condicao.idOpcao)))
        });
    }

    abstract obtemOpcaoAValidar(idOpcao: number): number;

    get alterando(): boolean { return this._alterando; }
    abstract get finalizado(): boolean;
    abstract get pvGanhoIndividual(): number;
    abstract get peGanhoIndividual(): number;
    abstract get psGanhoIndividual(): number;

    carregaPontosObrigatorios(pontosObrigatorios: { mensagem: string, operador?: OperadorCondicao; condicoes: { idOpcao: number, regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[]) {
        this.pontosObrigatorios = pontosObrigatorios.map(ponto => {
            return new ValidacoesGanhoNex(
                {
                    operador: ponto.operador,
                    condicoes: ponto.condicoes.map(condicao => {
                        return new CondicaoGanhoNex(
                            condicao.idOpcao,
                            condicao.regra,
                            condicao.valorCondicao,
                        );
                    }),
                },
                ponto.mensagem
            );
        });
    }
}

export class GanhoIndividualNexFactory {
    public static ficha: RLJ_Ficha2;

    static setFicha(ficha: RLJ_Ficha2) {
        GanhoIndividualNexFactory.ficha = ficha;
    }
}

export class GanhoIndividualNexEscolhaClasse extends GanhoIndividualNex {
    public idOpcaoEscolhida: number | undefined;
    public tituloEtapa = 'Seleção de Classe';

    constructor(escolha: boolean = false) {
        super(escolha);
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [
            {
                mensagem: `Selecione sua Classe`,
                icone: (this.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
            },
        ];
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    setIdEscolhido(id: number) { this.idOpcaoEscolhida = id; }

    get finalizado(): boolean { return this.idOpcaoEscolhida !== undefined && this.idOpcaoEscolhida > 1; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }

    get refClasseEscolhida(): Classe | undefined { return SingletonHelper.getInstance().classes.find(classe => classe.id === this.idOpcaoEscolhida); }
}

export class GanhoIndividualNexHabilidade extends GanhoIndividualNex {
    public numeroHabilidadesGanhas: number;
    public numeroHabilidadesInicial: number;
    public dadosHabilidades: PropsHabilidades[] = [];
    public tituloEtapa = 'Habilidades Especiais';

    constructor(ganhoHabilidadeProps: GanhoHabilidadeProps) {
        super(ganhoHabilidadeProps.numeroDeHabilidades > 0);
        this.numeroHabilidadesGanhas = ganhoHabilidadeProps.numeroDeHabilidades;
        this.dadosHabilidades = this._refFicha.habilidadesEspeciais || [];
        this.numeroHabilidadesInicial = this.dadosHabilidades.length;
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [
            {
                mensagem: `Ganho de ${this.numeroHabilidadesGanhas} Habilidades${this.numeroHabilidadesGanhas > 0 ? ` (${this.numeroHabilidadesGanhas} ${pluralize(this.numeroHabilidadesGanhas, 'Restante')})` : ' (Concluído)'}`,
                icone: (this.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
            }
        ];
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    get finalizado(): boolean { return this.numeroHabilidadesGanhas === this.dadosHabilidades.length; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }

    get numeroHabilidadesEsperadoNoFim(): number { return this.numeroHabilidadesInicial + this.numeroHabilidadesGanhas; }
    get numeroHabilidadesPendentes(): number { return this.numeroHabilidadesEsperadoNoFim - this.dadosHabilidades.length; }
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoEmGanho[];
    public tituloEtapa = 'Atributos';
    public valorMaxAtributo: number;

    constructor(valoresGanhoETrocaProps: ValoresGanhoETrocaProps) {
        const ganhos = new ValoresGanhoETroca(valoresGanhoETrocaProps.ganhos, valoresGanhoETrocaProps.trocas);
        super(ganhos.alterando);
        this.ganhosAtributo = ganhos;
        this.valorMaxAtributo = obterMaximoAtributo(this._refFicha.detalhes.idNivel+1);
        this.atributos = this._refFicha.atributos?.map(atributoBase => new AtributoEmGanho(SingletonHelper.getInstance().atributos.find(atributo => atributo.id === atributoBase.id)!, atributoBase.valor, this.valorMaxAtributo))!;
        this.carregaGanhosEstatisticasAtributos();
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return this.atributos.find(atributo => atributo.refAtributo.id === idOpcao)!.valorAtual
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [
            { mensagem: `O Valor Máximo de Atributo no momento é ${this.valorMaxAtributo}`, icone: '' },
            { mensagem: 'O Valor Mínimo de Atributo é 0', icone: '' },

            ...(
                this.ganhosAtributo.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosAtributo.ganhos.valorInicial} Atributos${this.ganhosAtributo.pontosGanhoRestantes > 0 ? ` (${this.ganhosAtributo.pontosGanhoRestantes} ${pluralize(this.ganhosAtributo.pontosGanhoRestantes, 'Restante')})` : ' (Concluído)'}`,
                        icone: (this.ganhosAtributo.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),

            ...(
                this.ganhosAtributo.trocas.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosAtributo.trocas.valorInicial} Atributo${this.ganhosAtributo.pontosTrocaRestantes > 0 ? ` (${this.ganhosAtributo.pontosTrocaRestantes} ${pluralize(this.ganhosAtributo.pontosTrocaRestantes, 'Disponível', 'Disponíveis')})` : ' (Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                    }]
                    : []
            ),

            ...this.pontosObrigatorios.map(ponto => ({
                mensagem: ponto.mensagem!,
                icone: ponto.iconeValidacao
            }))
        ];
    }

    carregaGanhosEstatisticasAtributos() {
        const ganhosEstatisticas = obterGanhosEstatisticas(this._refFicha.detalhes?.idClasse!);

        this.atributos.forEach(atributo => {
            atributo.ganhosEstatisticas = ganhosEstatisticas.find(ganho => ganho.idAtributo === atributo.refAtributo.id)?.ganhos!;
        })
    }

    get finalizado(): boolean { return this.ganhosAtributo.finalizado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0); }
    get psGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0); }
    get peGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0); }

    adicionaPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.realizaTroca() : this.ganhosAtributo.realizaGanho();

        atributo.alterarValor(1);

        this.validaCondicoes();
    }

    subtraiPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        atributo.alterarValor(-1);

        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.desrealizaTroca() : this.ganhosAtributo.desrealizaGanho();

        this.validaCondicoes();
    }
}

export class GanhoIndividualNexEstatisticaFixa extends GanhoIndividualNex {
    public ganhoPv: number;
    public ganhoPs: number;
    public ganhoPe: number;
    public tituloEtapa = 'Estatísticas';

    constructor(ganhosEstatisticaProps: GanhosEstatisticaProps) {
        super(ganhosEstatisticaProps.pv > 0 || ganhosEstatisticaProps.ps > 0 || ganhosEstatisticaProps.pe > 0);
        this.ganhoPv = ganhosEstatisticaProps.pv;
        this.ganhoPs = ganhosEstatisticaProps.ps;
        this.ganhoPe = ganhosEstatisticaProps.pe;
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [
            { mensagem: `Ganho de P.V.: +${this.ganhoPv}`, icone: '' },
            { mensagem: `Ganho de P.S.: +${this.ganhoPs}`, icone: '' },
            { mensagem: `Ganho de P.E.: +${this.ganhoPe}`, icone: '' },
        ];
    }

    get finalizado(): boolean { return true; }
    get pvGanhoIndividual(): number { return this.ganhoPv; }
    get psGanhoIndividual(): number { return this.ganhoPs; }
    get peGanhoIndividual(): number { return this.ganhoPe; }
}

export class GanhoIndividualNexPericia extends GanhoIndividualNex {
    public ganhosTreinadas: ValoresGanhoETroca;
    public ganhosVeteranas: ValoresGanhoETroca;
    public ganhosExperts: ValoresGanhoETroca;
    public ganhosLivres: ValoresGanhoETroca;
    public pericias: PericiaEmGanho[];
    public tituloEtapa = 'Perícias';

    obtemOpcaoAValidar(idOpcao: number): number {
        return this.pericias.find(pericia => pericia.refPericia.id === idOpcao)!.refPatenteAtual.id;
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [

            ...(
                this.ganhosTreinadas.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosTreinadas.ganhos.valorInicial} Perícias Treinadas${this.ganhosTreinadas.pontosGanhoRestantes > 0 ? ` (${this.ganhosTreinadas.pontosGanhoRestantes} ${pluralize(this.ganhosTreinadas.pontosGanhoRestantes, 'Restante')})` : ' (Concluído)'}`,
                        icone: (this.ganhosTreinadas.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosVeteranas.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosVeteranas.ganhos.valorInicial} Perícias Veteranas${this.ganhosVeteranas.pontosGanhoRestantes > 0 ? ` (${this.ganhosVeteranas.pontosGanhoRestantes} ${pluralize(this.ganhosVeteranas.pontosGanhoRestantes, 'Restante')})` : ' (Concluído)'}`,
                        icone: (this.ganhosVeteranas.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosExperts.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosExperts.ganhos.valorInicial} Perícias Experts${this.ganhosExperts.pontosGanhoRestantes > 0 ? ` (${this.ganhosExperts.pontosGanhoRestantes} ${pluralize(this.ganhosExperts.pontosGanhoRestantes, 'Restante')})` : ' (Concluído)'}`,
                        icone: (this.ganhosExperts.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosLivres.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosLivres.ganhos.valorInicial} Perícias Livres${this.ganhosLivres.pontosGanhoRestantes > 0 ? ` (${this.ganhosLivres.pontosGanhoRestantes} ${pluralize(this.ganhosLivres.pontosGanhoRestantes, 'Restante')})` : ' (Concluído)'}`,
                        icone: (this.ganhosLivres.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),

            ...(
                this.ganhosTreinadas.trocas.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosTreinadas.trocas.valorInicial} Perícia Treinada${this.ganhosTreinadas.pontosTrocaRestantes > 0 ? ` (${this.ganhosTreinadas.pontosTrocaRestantes} ${pluralize(this.ganhosTreinadas.pontosTrocaRestantes, 'Disponível', 'Disponíveis')})` : ' (Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                    }]
                    : []
            ),
            ...(
                this.ganhosVeteranas.trocas.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosVeteranas.trocas.valorInicial} Perícia Veterana${this.ganhosVeteranas.pontosTrocaRestantes > 0 ? ` (${this.ganhosVeteranas.pontosTrocaRestantes} ${pluralize(this.ganhosVeteranas.pontosTrocaRestantes, 'Disponível', 'Disponíveis')})` : ' (Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                    }]
                    : []
            ),
            ...(
                this.ganhosExperts.trocas.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosExperts.trocas.valorInicial} Perícia Expert${this.ganhosExperts.pontosTrocaRestantes > 0 ? ` (${this.ganhosExperts.pontosTrocaRestantes} ${pluralize(this.ganhosExperts.pontosTrocaRestantes, 'Disponível', 'Disponíveis')})` : ' (Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                    }]
                    : []
            ),
            ...(
                this.ganhosLivres.trocas.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosLivres.trocas.valorInicial} Perícia Livre${this.ganhosLivres.pontosTrocaRestantes > 0 ? ` (${this.ganhosLivres.pontosTrocaRestantes} ${pluralize(this.ganhosLivres.pontosTrocaRestantes, 'Disponível', 'Disponíveis')})` : ' (Usado)'}`,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } })
                    }]
                    : []
            ),

            ...this.pontosObrigatorios.map(ponto => ({
                mensagem: ponto.mensagem!,
                icone: ponto.iconeValidacao
            }))
        ];
    }

    constructor(valoresGanhoETrocaPropsTreinadas: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsVeteranas: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsExperts: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsLivres: ValoresGanhoETrocaProps) {
        const ganhosTreinadas = new ValoresGanhoETroca(valoresGanhoETrocaPropsTreinadas.ganhos, valoresGanhoETrocaPropsTreinadas.trocas);
        const ganhosVeteranas = new ValoresGanhoETroca(valoresGanhoETrocaPropsVeteranas.ganhos, valoresGanhoETrocaPropsVeteranas.trocas);
        const ganhosExperts = new ValoresGanhoETroca(valoresGanhoETrocaPropsExperts.ganhos, valoresGanhoETrocaPropsExperts.trocas);
        const ganhosLivres = new ValoresGanhoETroca(valoresGanhoETrocaPropsLivres.ganhos, valoresGanhoETrocaPropsLivres.trocas);
        super(ganhosTreinadas.alterando || ganhosVeteranas.alterando || ganhosExperts.alterando || ganhosLivres.alterando);

        this.ganhosTreinadas = ganhosTreinadas;
        this.ganhosVeteranas = ganhosVeteranas;
        this.ganhosExperts = ganhosExperts;
        this.ganhosLivres = ganhosLivres;

        this.pericias = this._refFicha.periciasPatentes?.map(pericia_patente => new PericiaEmGanho(
            SingletonHelper.getInstance().pericias.find(pericia => pericia.id === pericia_patente.idPericia)!,
            pericia_patente.idPatente
        ))!;
    }

    get finalizado(): boolean {
        return (
            this.ganhosTreinadas.finalizado &&
            this.ganhosVeteranas.finalizado &&
            this.ganhosExperts.finalizado &&
            this.ganhosLivres.finalizado
        );
    }

    temPontosParaEssaPatente(pericia: PericiaEmGanho): boolean {
        switch (pericia.idPatenteAtual) {
            case 1:
                return this.ganhosTreinadas.ganhoTemPontos!;
            case 2:
                return this.ganhosVeteranas.ganhoTemPontos!;
            case 3:
                return this.ganhosExperts.ganhoTemPontos!;
            default:
                return false;
        }
    }

    deparaPericiaPatente(pericia: PericiaEmGanho): ValoresGanhoETroca | undefined {
        switch (pericia.refPatenteAtual.id) {
            case 2:
                return this.ganhosTreinadas;
            case 3:
                return this.ganhosVeteranas;
            case 4:
                return this.ganhosExperts;
        }
    }

    adicionaPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;

        pericia.alterarValor(1);

        const valorGanhoeETrocaPatenteAtual = this.deparaPericiaPatente(pericia);

        (pericia.refPatenteAtual.id === pericia.refPatenteInicial.id) ? valorGanhoeETrocaPatenteAtual!.realizaTroca() : valorGanhoeETrocaPatenteAtual!.realizaGanho();

        this.validaCondicoes();
    }

    subtraiPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;
        const valorGanhoeETrocaPatenteAntesSubtrair = this.deparaPericiaPatente(pericia);

        pericia.alterarValor(-1);

        (pericia.refPatenteAtual.id < pericia.refPatenteInicial.id ) ? valorGanhoeETrocaPatenteAntesSubtrair!.desrealizaTroca() : valorGanhoeETrocaPatenteAntesSubtrair!.desrealizaGanho();

        this.validaCondicoes();
    }

    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

export class GanhoIndividualNexRitual extends GanhoIndividualNex {
    public numeroRituaisGanhos: number;
    public numeroRituaisInicial: number;
    public dadosRituais: { dadosRitual: ArgsRitual, emCriacao: boolean }[] = [];
    public tituloEtapa = 'Criação de Rituais';

    constructor(ganhoRitualProps: GanhoRitualProps) {
        super(ganhoRitualProps.numeroDeRituais > 0);
        this.numeroRituaisGanhos = ganhoRitualProps.numeroDeRituais;
        this.dadosRituais = (this._refFicha.rituais || []).map(dadosRitual => ({ dadosRitual, emCriacao: false }));
        this.numeroRituaisInicial = this.dadosRituais.length;
    }

    public get avisoGanhoNex(): AvisoGanhoNex[] {
        return [
            {
                mensagem: `Ganho de ${this.numeroRituaisGanhos} Rituais${this.numeroRituaisPendentes > 0 ? ` (${this.numeroRituaisPendentes} ${pluralize(this.numeroRituaisPendentes, 'Restante')})` : ' (Concluído)'}`,
                icone: (this.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
            }
        ];
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    get finalizado(): boolean { return this.numeroRituaisGanhos === this.dadosRituais.filter(dadosRitual => dadosRitual.emCriacao).length; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }

    get numeroRituaisPendentes(): number { return this.numeroRituaisGanhos - this.dadosRituais.filter(dadosRitual => dadosRitual.emCriacao).length; }
}

// #endregion

// #region ClassesGanho
export class GanhoEstatisticaPorPontoDeAtributo {
    constructor(
        private _idEstatistica: number,
        public valorPorPonto: number
    ) { }

    get refEstatistica(): TipoEstatisticaDanificavel { return SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === this._idEstatistica)! };
}

export class ValorUtilizavel {
    public valorAtual: number;
    constructor(public valorInicial: number) { this.valorAtual = this.valorInicial; }

    get valorZerado(): boolean { return this.valorAtual === 0; }
    get valorAbaixoDeZero(): boolean { return this.valorAtual < 0; }

    aumentaValor() { this.valorAtual++; }
    diminuiValor() { this.valorAtual--; }
}

export class ValoresGanhoETroca {
    public ganhos: ValorUtilizavel;
    public trocas: ValorUtilizavel;

    constructor(numeroGanhos: number = 0, numeroTrocas: number = 0) {
        this.ganhos = new ValorUtilizavel(numeroGanhos);
        this.trocas = new ValorUtilizavel(numeroTrocas);
    }

    realizaGanho() { this.ganhos.diminuiValor(); }
    desrealizaGanho() { this.ganhos.aumentaValor(); }

    realizaTroca() { this.realizaGanho(); this.trocas.aumentaValor(); }
    desrealizaTroca() { this.desrealizaGanho(); this.trocas.diminuiValor(); }

    get ganhoTemPontos(): boolean { return !this.ganhos.valorZerado; }
    get pontosGanhoRestantes(): number { return this.ganhos.valorAtual; }
    get trocaTemPontos(): boolean { return !this.trocas.valorZerado; }
    get pontosTrocaRestantes(): number { return this.trocas.valorAtual; }
    get alterando(): boolean { return this.ganhos.valorInicial > 0 || this.trocas.valorInicial > 0; }
    get finalizado(): boolean { return this.ganhos.valorZerado; }
}

export class AtributoEmGanho {
    public ganhosEstatisticas: GanhoEstatisticaPorPontoDeAtributo[] = [];
    public valorAtual: number;

    constructor(
        private _refAtributo: Atributo,
        private _valorInicial: number,
        private _valorMaximo: number,
    ) {
        this.valorAtual = this._valorInicial;
    }

    get refAtributo(): Atributo { return this._refAtributo; }
    get valorInicial(): number { return this._valorInicial; }
    get valorMaximo(): number { return this._valorMaximo; }

    alterarValor(modificador: number) {
        this.valorAtual += modificador;
    }

    ganhoEstatistica(idEstatistica: number): number {
        const ganho = this.ganhosEstatisticas.find(ganhoEstatistica => ganhoEstatistica.refEstatistica.id === idEstatistica);

        return ganho ? ganho.valorPorPonto * this.valorAtual : 0;
    }

    get menorQueInicialmente(): boolean { return this.valorAtual < this._valorInicial }
    get estaEmValorMaximo(): boolean { return this.valorAtual >= this._valorMaximo }
    get estaEmValorMinimo(): boolean { return this.valorAtual < 1 }
    get estaMaiorQueInicial(): boolean { return this.valorAtual > this._valorInicial }
}

export class PericiaEmGanho {
    public idPatenteAtual: number;

    constructor(
        private _refPericia: Pericia,
        private _idPatenteInicial: number,
    ) {
        this.idPatenteAtual = this._idPatenteInicial;
    }

    get refPericia(): Pericia { return this._refPericia; }
    get refPatenteInicial(): PatentePericia { return this._refPatente(this._idPatenteInicial); }
    get refPatenteAtual(): PatentePericia { return this._refPatente(this.idPatenteAtual); }
    get estaEmValorMinimo(): boolean { return this.idPatenteAtual === 1; }
    get estaMaiorQueInicial(): boolean { return this.idPatenteAtual > this._idPatenteInicial }

    private _refPatente(idPatente: number): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === idPatente)!; }
    alterarValor(modificador: number) { this.idPatenteAtual += modificador; }
}
// #endregion

// #region LogicaDeGanho
export class ControladorGanhos {
    private mapaGanhoObrigatorio: { [idNivel: number]: { [idClasse: number]: { [Ctor: string]: { mensagem: string; operador?: OperadorCondicao; condicoes: { idOpcao: number; regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[] } } } = {
        1: {
            1: {
                GanhoIndividualNexPericia: [
                    {
                        condicoes: [
                            { idOpcao: 16, regra: 'igual', valorCondicao: 1 },
                        ],
                        mensagem: 'Você não pode ser Treinado em Ocultismo',
                    }
                ],
            }
        },
        3: {
            2: {
                GanhoIndividualNexAtributo: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 1, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 2, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 5, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ter Mais de 1 em Agilidade, Força ou Vigor',
                    },
                ],
                GanhoIndividualNexPericia: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 5, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 8, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Pontaria ou Luta',
                    },
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 6, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 26, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Reflexo ou Fortitude',
                    }
                ],
            },
            4: {
                GanhoIndividualNexAtributo: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 3, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 4, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ter Mais de 1 em Inteligência ou Presença',
                    },
                ],
                GanhoIndividualNexPericia: [
                    {
                        condicoes: [
                            { idOpcao: 16, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Ocultismo',
                    },
                ],
            }
        }
    }

    private testeGanhosAtributos: { [nivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[]; } = {
        // começa com 5
        1: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 })], // vai pra 7, limite 3
        3: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 })], // vai pra 9, limite 3
        // combatente vai para 10 no 5 (20%)
        7: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 10/12, limite 4
        // combatente vai para 13 no 9 (40%)
        11: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 11/15, limite 5
        13: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 12/17, limite 5
        15: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 13/19, limite 5
        // combatente vai para 20 no 17 (80), limite 6
        19: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 14/22, limite 6
        20: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 15,23, limite 6
        21: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })], // vai para 16,25, limite 7
    };

    private mapaValorMaximoAtributo: { [nivel: number]: { readonly maximo: number } } = {
        1: { maximo: 3 },
        7: { maximo: 4 },
        11: { maximo: 5 },
        17: { maximo: 6 },
        21: { maximo: 7 }
    };

    public obterGanhoObrigatorio(idNivel: number, idClasse: number): { [Ctor: string]: { mensagem: string; operador?: OperadorCondicao; condicoes: { idOpcao: number; regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[] } {
        return this.mapaGanhoObrigatorio[idNivel]?.[idClasse] || {};
    }

    public obterValorMaximoDeAtributoNoNivel(nivel: number): number {
        const niveis = Object.keys(this.mapaValorMaximoAtributo).map(Number).sort((a, b) => a - b);

        let nivelMaisBaixo = niveis[0];
        for (const n of niveis) {
            if (nivel >= n) {
                nivelMaisBaixo = n;
            } else {
                break;
            }
        }

        return this.mapaValorMaximoAtributo[nivelMaisBaixo].maximo;
    }

    private mapaGanhos: { [idNivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[]; } = {
        1: [ // NEX 0
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 2, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
        ],
        2: [ // NEX 5
            instanciaComArgumentos(GanhoIndividualNexEstatisticaFixa, { pv: 5, ps: 10, pe: 5 }),
        ],
        3: [], // NEX 10
        4: [ // NEX 15
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 1, trocas: 1 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
        ],
        5: [ // NEX 20
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 0, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 1, trocas: 0 }, { ganhos: 1, trocas: 1 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
            // 1 moeda
        ],
        6: [ // NEX 25
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 2, trocas: 1 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            // habilidade paranormal
        ],
        7: [ // NEX 30
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 1 }, { ganhos: 2, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
            // 1 moeda
        ],
        8: [ // NEX 35
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 1 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            // 2 moeda
        ],
        9: [ // NEX 40
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
        ],
        10: [ // NEX 45
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 1 }, { ganhos: 0, trocas: 1 }, { ganhos: 1, trocas: 1 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            // habilidade paranormal
        ],
        11: [ // NEX 50
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 1, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
            // slot passiva elemental
        ],
        12: [ // NEX 55
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 1 }, { ganhos: 0, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            // habilidade paranormal
            // slot passiva elemental
        ],
        13: [ // NEX 60
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            // slot passiva elemental
        ],
        14: [ // NEX 65
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 1 }, { ganhos: 0, trocas: 1 }, { ganhos: 0, trocas: 1 }, { ganhos: 0, trocas: 1 }),
            // habilidade paranormal
            // slot passiva elemental
        ],
        15: [ // NEX 70
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }),
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            instanciaComArgumentos(GanhoIndividualNexHabilidade, { numeroDeHabilidades: 1 }),
            // slot passiva elemental
        ],
        16: [ // NEX 75
            instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            // habilidade paranormal
            // slot passiva elemental
        ],
        17: [ // NEX 80
        ],
        18: [ // NEX 85
        ],
        19: [ // NEX 90
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
        ],
        20: [ // NEX 95
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
        ],
        21: [ // NEX 99
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 1 }),
        ],
    };

    private mapaGanhosClasse: { [idClasse: number]: { [idNivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[] } } = {
        1: { // ganho de classe do 10, quando vc ainda é mundano
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexEscolhaClasse, true),
            ],
        },
        2: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 5, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            ],
            5: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            7: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            9: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            11: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            13: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            15: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            17: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            19: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
            21: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 }),],
        },
        3: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 7, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            ],
            5: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),],
            7: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 1, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),],
            9: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),],
            11: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }),],
            13: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }),],
            15: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }),],
            17: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 1, trocas: 0 }),],
            19: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 2, trocas: 0 }),],
            21: [instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 2, trocas: 0 }),],
        },
        4: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 4, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),
            ],
            5: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            7: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            9: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            11: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            13: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            15: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            17: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            19: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
            21: [instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 }),],
        },
    }

    private mapaGanhosEstatisticas: { [idClasse: number]: { [idAtributo: number]: { [idEstatisticaDanificavel: number]: { valor: number } } } } = {
        // Classe Mundano
        1: {
            1: {
                1: { valor: 0.0 },
                2: { valor: 0.0 },
                3: { valor: 0.3 }
            },
            2: {
                1: { valor: 1.0 },
                2: { valor: 0.0 },
                3: { valor: 0.3 },
            },
            3: {
                1: { valor: 0.0 },
                2: { valor: 0.5 },
                3: { valor: 0.0 },
            },
            4: {
                1: { valor: 0.0 },
                2: { valor: 0.5 },
                3: { valor: 0.0 },
            },
            5: {
                1: { valor: 2.0 },
                2: { valor: 0.0 },
                3: { valor: 0.3 },
            },
        },
        // Classe Combatente
        2: {
            1: {
                1: { valor: 0.3 },
                2: { valor: 0.4 },
                3: { valor: 1.0 }
            },
            2: {
                1: { valor: 0.6 },
                2: { valor: 0.4 },
                3: { valor: 0.6 },
            },
            3: {
                1: { valor: 0.6 },
                2: { valor: 1.0 },
                3: { valor: 1.0 },
            },
            4: {
                1: { valor: 0.4 },
                2: { valor: 0.8 },
                3: { valor: 0.4 },
            },
            5: {
                1: { valor: 1.5 },
                2: { valor: 0.8 },
                3: { valor: 0.5 },
            },
        },
        // Classe Especialista
        3: {
            1: {
                1: { valor: 0.3 },
                2: { valor: 0.4 },
                3: { valor: 0.8 }
            },
            2: {
                1: { valor: 0.4 },
                2: { valor: 0.4 },
                3: { valor: 0.8 },
            },
            3: {
                1: { valor: 0.6 },
                2: { valor: 1.0 },
                3: { valor: 0.8 },
            },
            4: {
                1: { valor: 0.6 },
                2: { valor: 1.0 },
                3: { valor: 0.5 },
            },
            5: {
                1: { valor: 0.7 },
                2: { valor: 0.5 },
                3: { valor: 0.4 },
            },
        },
        // Classe Ocultista
        4: {
            1: {
                1: { valor: 0.3 },
                2: { valor: 0.8 },
                3: { valor: 0.5 }
            },
            2: {
                1: { valor: 0.4 },
                2: { valor: 0.8 },
                3: { valor: 0.5 },
            },
            3: {
                1: { valor: 0.6 },
                2: { valor: 1.4 },
                3: { valor: 1.0 },
            },
            4: {
                1: { valor: 0.3 },
                2: { valor: 1.0 },
                3: { valor: 0.6 },
            },
            5: {
                1: { valor: 0.6 },
                2: { valor: 1.0 },
                3: { valor: 0.3 },
            },
        },
    }

    obterGanhosEstatisticasDoAtributoPorClasse(idClasse: number): { idAtributo: number, ganhos: GanhoEstatisticaPorPontoDeAtributo[] }[] {
        const atributosDaClasse = this.mapaGanhosEstatisticas[idClasse];

        if (!atributosDaClasse) {
            return [];
        }

        return Object.entries(atributosDaClasse).map(([idAtributo, estatisticas]) => ({
            idAtributo: parseInt(idAtributo),
            ganhos: Object.entries(estatisticas).map(([idEstatistica, { valor }]) => (new GanhoEstatisticaPorPontoDeAtributo(parseInt(idEstatistica), valor))),
        }));
    }

    obterGanhosGerais(idNivel: number, idClasse: number): GanhoIndividualNex[] {
        const ganhosPadrao = this.obterGanhosPorNivel(idNivel);
        const ganhosClasse = this.obterGanhosDeClassePorNivel(idNivel, idClasse);
        const ganhosObrigatorios = this.obterGanhoObrigatorio(idNivel, idClasse);

        const ganhosCombinados: { [key: string]: { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] } } = {};

        const processarGanhos = (ganhos: { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[]) => {
            ganhos.forEach(ganho => {
                const key = ganho.Ctor.name;

                if (ganhosCombinados[key]) {
                    ganhosCombinados[key].params = this.combinarParams(ganhosCombinados[key].Ctor, ganhosCombinados[key].params, ganho.params);
                } else {
                    ganhosCombinados[key] = { Ctor: ganho.Ctor, params: ganho.params };
                }
            });
        };

        processarGanhos(ganhosPadrao);
        processarGanhos(ganhosClasse);

        if (!ganhosCombinados[GanhoIndividualNexAtributo.name] && idNivel !== 2) ganhosCombinados[GanhoIndividualNexAtributo.name] = { Ctor: GanhoIndividualNexAtributo, params: [{ ganhos: 0, trocas: 0 }] };

        return Object.values(ganhosCombinados).map(ganho => {
            const newClass = new ganho.Ctor(...ganho.params);
            newClass.carregaPontosObrigatorios(ganhosObrigatorios[ganho.Ctor.name] ?? []);
            return newClass;
        });
    }

    private obterGanhosDeClassePorNivel(nivel: number, idClasse: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhosClasse[idClasse]?.[nivel] ?? [];
    }

    private obterGanhosPorNivel(nivel: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhos[nivel] ?? [];
    }

    public obterMaximoAtributoPorNivel(nivel: number): number {
        return this.mapaValorMaximoAtributo[nivel].maximo || 3;
    }

    private combinarParams(Ctor: new (...args: any[]) => GanhoIndividualNex, params1: any[], params2: any[]): any[] {
        if (Ctor === GanhoIndividualNexAtributo) {
            return [{ ganhos: params1[0].ganhos + params2[0].ganhos, trocas: params1[0].trocas + params2[0].trocas }];
        } else if (Ctor === GanhoIndividualNexPericia) {
            return params1.map((param, index) => ({ ganhos: param.ganhos + params2[index].ganhos, trocas: param.trocas + params2[index].trocas }));
        } else if (Ctor === GanhoIndividualNexEstatisticaFixa) {
            return [{ pv: params1[0].pv + params2[0].pv, ps: params1[0].ps + params2[0].ps, pe: params1[0].pe + params2[0].pe }]
        }

        return [];
    }
}

const controladorGanhos = new ControladorGanhos();
export const obterGanhosGerais = (idNivel: number, idClasse: number) => controladorGanhos.obterGanhosGerais(idNivel, idClasse);
export const obterGanhosEstatisticas = (idNivel: number) => controladorGanhos.obterGanhosEstatisticasDoAtributoPorClasse(idNivel);
export const obterGanhosObrigatorio = (idNivel: number, idClasse: number) => controladorGanhos.obterGanhoObrigatorio(idNivel, idClasse);
export const obterMaximoAtributo = (idNivel: number) => controladorGanhos.obterMaximoAtributoPorNivel(idNivel);
// #endregion

function instanciaComArgumentos<T extends new (...args: any[]) => any>(
    Ctor: T,
    ...params: ConstructorParameters<T>
) {
    return { Ctor, params } as const;
}

interface ValoresGanhoETrocaProps {
    ganhos: number,
    trocas: number,
}

interface GanhosEstatisticaProps {
    pv: number,
    ps: number,
    pe: number,
}

interface GanhoRitualProps {
    numeroDeRituais: number,
}

interface GanhoHabilidadeProps {
    numeroDeHabilidades: number,
}
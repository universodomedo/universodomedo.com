// #region Imports
import { Acao, adicionaSinalEmNumeroParaExibicao, Efeito, FiltroProps, FiltroPropsItems, HabilidadePassiva, Item, LinhaEfeito, Modificador, RegistroValorEfeito, ValoresEfeito, ValoresLinhaEfeitoAgrupados } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
// #endregion

export class ControladorModificadores {
    private _modificadores: Modificador[] = [];

    adicionaModificador(modificador: Modificador) {
        if (this.modificadores.some(modificadorAtual => modificadorAtual.codigoUnico === modificador.codigoUnico)) this.removeModificador(modificador);
        this._modificadores.push(modificador);
    }

    removeModificador(modificador: Modificador) { this._modificadores = this._modificadores.filter(modEquivalente => modEquivalente.codigoUnico !== modificador.codigoUnico); }
    valoresEfeitoPorLinhaEfeito(idLinhaEfeito: number): ValoresEfeito { return this.valoresEfeitosEDetalhesPorLinhaEfeito.find(info => info.refLinhaEfeito.id === idLinhaEfeito)?.valoresEfeitos || new ValoresEfeito({}); }
    detalhesPorLinhaEfeito(idLinhaEfeito: number): string[] { return this.valoresEfeitosEDetalhesPorLinhaEfeito.find(info => info.refLinhaEfeito.id === idLinhaEfeito)?.valoresEfeitos.listaValorBonusAdicional.map(bonus => `${bonus.nomeRegistro}: ${adicionaSinalEmNumeroParaExibicao(bonus.valor)}`) || []; }

    // prototipoSobrecarga():Buff|void {
    //     const personagem = getPersonagemFromContext();

    //     if (personagem.inventario.espacosUsados > personagem.estatisticasBuffaveis.espacoInventario.espacoTotal) {
    //         return new Buff(53, `Sobrecarga`, 0, 5, 0, 4, { dadosComportamentoAtivo: [] }, .5);
    //     }
    // }

    get modificadores(): Modificador[] { return this._modificadores; }

    get valoresEfeitosEDetalhesPorLinhaEfeito(): ValoresLinhaEfeito[] {
        const valores: ValoresLinhaEfeito[] = [];

        this.agrupamentoDeEfeitosPorLinhaEfeito.forEach(({ idLinhaEfeito, listaEfeitosNaLinha }) => {
            const listaValorBaseAdicional: RegistroValorEfeito[] = [];
            const listaPorcentagemAdicional: RegistroValorEfeito[] = [];
            const listaValorBonusAdicional: RegistroValorEfeito[] = [];

            [1, 2, 3].forEach(idTipoEfeito => {
                const agrupado = listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === idTipoEfeito);

                if (agrupado.length > 0) {
                    const maiorValorBaseAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBaseAdicional > maior.efeito.valoresEfeitos.valorBaseAdicional ? atual : maior, agrupado[0]);
                    if (maiorValorBaseAdicional.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: maiorValorBaseAdicional.tipoPaiModificador, nomeRegistro: maiorValorBaseAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorValorBaseAdicional.efeito.valoresEfeitos.valorBaseAdicional });

                    const maiorPorcentagemAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorPorcentagemAdicional > maior.efeito.valoresEfeitos.valorPorcentagemAdicional ? atual : maior, agrupado[0]);
                    if (maiorPorcentagemAdicional.efeito.valoresEfeitos.valorPorcentagemAdicional !== 0) listaPorcentagemAdicional.push({ tipoPai: maiorPorcentagemAdicional.tipoPaiModificador, nomeRegistro: maiorPorcentagemAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorPorcentagemAdicional.efeito.valoresEfeitos.valorPorcentagemAdicional });

                    const maiorValorBonusAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBonusAdicional > maior.efeito.valoresEfeitos.valorBonusAdicional ? atual : maior, agrupado[0]);
                    if (maiorValorBonusAdicional.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: maiorValorBonusAdicional.tipoPaiModificador, nomeRegistro: maiorValorBonusAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorValorBonusAdicional.efeito.valoresEfeitos.valorBonusAdicional });
                }
            });

            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 4).forEach(efeitos => {
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorBaseAdicional });

                if (efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional > 0) listaPorcentagemAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional });

                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorBonusAdicional });
            });

            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 5).forEach(efeitos => {
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorBaseAdicional });
                if (efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional > 0) listaPorcentagemAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional });
                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorBonusAdicional });
            });

            valores.push(new ValoresLinhaEfeito(idLinhaEfeito, new ValoresLinhaEfeitoAgrupados({ listaValorBaseAdicional, listaPorcentagemAdicional, listaValorBonusAdicional })));
        });

        return valores;
    }

    get agrupamentoDeEfeitosPorLinhaEfeito(): { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, tipoPaiModificador: string, efeito: Efeito }[] }[] {
        const agrupados: { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, tipoPaiModificador: string, efeito: Efeito }[] }[] = [];

        this.modificadores.forEach(modificador => {
            modificador.efeitos.forEach(efeito => {
                const idLinhaEfeito = efeito.refLinhaEfeito.id;

                let grupo = agrupados.find(g => g.idLinhaEfeito === idLinhaEfeito);

                if (!grupo) {
                    grupo = { idLinhaEfeito, listaEfeitosNaLinha: [] };
                    agrupados.push(grupo);
                }

                let tipoPaiModificador = '';
                if (modificador.refPai instanceof Acao) tipoPaiModificador = 'Ação';
                if (modificador.refPai instanceof HabilidadePassiva) tipoPaiModificador = 'Habilidade';
                if (modificador.refPai instanceof Item) tipoPaiModificador = 'Item';

                grupo.listaEfeitosNaLinha.push({ nomeModificador: modificador.nome, tipoPaiModificador: tipoPaiModificador, efeito: efeito });
            });
        });

        return agrupados;
    }
}

export class ValoresLinhaEfeito {
    constructor(
        private _idLinhaEfeito: number,
        public valoresEfeitos: ValoresLinhaEfeitoAgrupados,
    ) { }

    static get filtroProps(): FiltroProps<ValoresLinhaEfeito> {
        return new FiltroProps<ValoresLinhaEfeito>(
            [
                new FiltroPropsItems<ValoresLinhaEfeito>(
                    (valoresLinhaEfeito) => valoresLinhaEfeito.refLinhaEfeito.nome,
                    'Nome da Fonte do Efeito',
                    'Procure pela Fonte do Efeito',
                    'text',
                    true
                ),
            ],
        )
    }

    // depois tem que habilidade esse retorno de string para o detalhemento de bonus
    // get teste(): string { return `Valor Base Extra: ${this.valoresEfeitos.valorBaseAdicional}; Valor Multiplicador: ${this.valoresEfeitos.valorMultiplicadorAdicional}; Valor Adicional ${this.valoresEfeitos.valorBonusAdicional}`; }
    get valoresEstaVazio(): boolean { return !this.valoresEfeitos.valorBaseAdicionalPresente && !this.valoresEfeitos.valorPorcentagemAdicionalPresente && !this.valoresEfeitos.valorBonusAdicionalPresente; }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}
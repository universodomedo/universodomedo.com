// #region Imports
import { Efeito, FiltroProps, FiltroPropsItems, LinhaEfeito, Modificador, ValoresEfeito } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class ControladorModificadores {
    private _modificadores: Modificador[] = [];

    adicionaModificador(modificador: Modificador) {
        if (this.modificadores.some(modificadorAtual => modificadorAtual.codigoUnico === modificador.codigoUnico)) this.removeModificador(modificador);
        this._modificadores.push(modificador);
    }

    removeModificador(modificador: Modificador) { this._modificadores = this._modificadores.filter(modEquivalente => modEquivalente.codigoUnico !== modificador.codigoUnico); }
    valoresEfeitoPorLinhaEfeito(idLinhaEfeito: number): ValoresEfeito { return this.valoresEfeitosEDetalhesPorLinhaEfeito.find(info => info.refLinhaEfeito.id === idLinhaEfeito)?.valoresEfeitos || new ValoresEfeito({}); }

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
            let valorBaseExtraFinal = 0;
            let valorMultiplicadorFinal = 1;
            let valorAdicionalFinal = 0;
            const textos: string[] = [];

            // Grupo 1
            const efeitosGrupo1 = listaEfeitosNaLinha.filter(efeitos => [1, 2, 3].includes(efeitos.efeito.refTipoEfeito.id));
            if (efeitosGrupo1.length > 0) {
                const maiorValorBaseExtraGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBaseAdicional > maior.efeito.valoresEfeitos.valorBaseAdicional ? atual : maior, efeitosGrupo1[0]);
                if (maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseAdicional > 0) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Base +${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseAdicional}`);
                valorBaseExtraFinal = maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseAdicional;

                const maiorValorMultiplicadorGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorMultiplicadorAdicional > maior.efeito.valoresEfeitos.valorMultiplicadorAdicional ? atual : maior, efeitosGrupo1[0]);
                if (maiorValorMultiplicadorGrupo1.efeito.valoresEfeitos.valorMultiplicadorAdicional !== 1) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Multiplicador *${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorMultiplicadorAdicional}`);
                valorMultiplicadorFinal = maiorValorMultiplicadorGrupo1.efeito.valoresEfeitos.valorMultiplicadorAdicional;

                const maiorValorAdicionalFinalGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBonusAdicional > maior.efeito.valoresEfeitos.valorBonusAdicional ? atual : maior, efeitosGrupo1[0])
                if (maiorValorAdicionalFinalGrupo1.efeito.valoresEfeitos.valorBonusAdicional > 0) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Adicional +${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBonusAdicional}`);
                valorAdicionalFinal = maiorValorAdicionalFinalGrupo1.efeito.valoresEfeitos.valorBonusAdicional;
            }

            // Grupo 2
            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 4).forEach(efeitos => {
                valorBaseExtraFinal += efeitos.efeito.valoresEfeitos.valorBaseAdicional;
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Base +${efeitos.efeito.valoresEfeitos.valorBaseAdicional}`);

                valorMultiplicadorFinal *= efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional;
                if (efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional !== 1) textos.push(`${efeitos.nomeModificador} - Valor Multiplicador *${efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional}`);

                valorAdicionalFinal += efeitos.efeito.valoresEfeitos.valorBonusAdicional;
                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Adicional +${efeitos.efeito.valoresEfeitos.valorBonusAdicional}`);
            });

            // Grupo 3
            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 5).forEach(efeitos => {
                valorBaseExtraFinal -= efeitos.efeito.valoresEfeitos.valorBaseAdicional;
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Base -${efeitos.efeito.valoresEfeitos.valorBaseAdicional}`);
                
                valorMultiplicadorFinal *= (1 / efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional);
                if (efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional !== 1) textos.push(`${efeitos.nomeModificador} - Valor Multiplicador -*${efeitos.efeito.valoresEfeitos.valorMultiplicadorAdicional}`);
                
                valorAdicionalFinal -= efeitos.efeito.valoresEfeitos.valorBonusAdicional;
                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Adicional -${efeitos.efeito.valoresEfeitos.valorBonusAdicional}`);
            });

            const valoresDaLinha = new ValoresEfeito({
                valorBaseAdicional: valorBaseExtraFinal,
                valorMultiplicadorAdicional: Math.round(valorMultiplicadorFinal * 10) / 10,
                valorBonusAdicional: valorAdicionalFinal,
            });

            valores.push(new ValoresLinhaEfeito(idLinhaEfeito, valoresDaLinha, textos));
        });

        return valores;
    }

    get agrupamentoDeEfeitosPorLinhaEfeito(): { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, efeito: Efeito }[] }[] {
        const agrupados: { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, efeito: Efeito }[] }[] = [];

        this.modificadores.forEach(modificador => {
            modificador.efeitos.forEach(efeito => {
                const idLinhaEfeito = efeito.refLinhaEfeito.id;

                let grupo = agrupados.find(g => g.idLinhaEfeito === idLinhaEfeito);

                if (!grupo) {
                    grupo = { idLinhaEfeito, listaEfeitosNaLinha: [] };
                    agrupados.push(grupo);
                }

                grupo.listaEfeitosNaLinha.push({ nomeModificador: modificador.nome, efeito: efeito });
            });
        });

        return agrupados;
    }
}

export class ValoresLinhaEfeito {
    constructor(
        private _idLinhaEfeito: number,
        public valoresEfeitos: ValoresEfeito,
        public textos: string[]
    ) { }

    static get filtroProps(): FiltroProps<ValoresLinhaEfeito> {
        return new FiltroProps<ValoresLinhaEfeito>(
            'Efeitos',
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

    get teste(): string { return `Valor Base Extra: ${this.valoresEfeitos.valorBaseAdicional}; Valor Multiplicador: ${this.valoresEfeitos.valorMultiplicadorAdicional}; Valor Adicional ${this.valoresEfeitos.valorBonusAdicional}`; }
    get valoresEstaVazio(): boolean { return (this.valoresEfeitos.valorBaseAdicional === 0 && this.valoresEfeitos.valorMultiplicadorAdicional === 1 && this.valoresEfeitos.valorBonusAdicional === 0)}

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}
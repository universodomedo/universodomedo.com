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
    valorPorIdLinhaEfeito(idLinhaEfeito: number): number { return this.efeitos.aplicados.filter(efeito => efeito.refLinhaEfeito.id === idLinhaEfeito)!.reduce((acc, cur) => acc + cur.valoresEfeitos.valorAdicional, 0); }
    valoresEfeitoPorLinhaEfeito(idLinhaEfeito: number): ValoresEfeito { return this.valoresEfeitosEDetalhesPorLinhaEfeito.find(info => info.refLinhaEfeito.id === idLinhaEfeito)!.valoresEfeitos; }

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
                const maiorValorBaseExtraGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBaseExtra > maior.efeito.valoresEfeitos.valorBaseExtra ? atual : maior, efeitosGrupo1[0]);
                if (maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseExtra > 0) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Base +${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseExtra}`);
                valorBaseExtraFinal = maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorBaseExtra;

                const maiorValorMultiplicadorGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorMultiplicador > maior.efeito.valoresEfeitos.valorMultiplicador ? atual : maior, efeitosGrupo1[0]);
                if (maiorValorMultiplicadorGrupo1.efeito.valoresEfeitos.valorMultiplicador !== 1) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Multiplicador *${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorMultiplicador}`);
                valorMultiplicadorFinal = maiorValorMultiplicadorGrupo1.efeito.valoresEfeitos.valorMultiplicador;

                const maiorValorAdicionalFinalGrupo1 = efeitosGrupo1.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorAdicional > maior.efeito.valoresEfeitos.valorAdicional ? atual : maior, efeitosGrupo1[0])
                if (maiorValorAdicionalFinalGrupo1.efeito.valoresEfeitos.valorAdicional > 0) textos.push(`${maiorValorBaseExtraGrupo1.nomeModificador} - Valor Adicional +${maiorValorBaseExtraGrupo1.efeito.valoresEfeitos.valorAdicional}`);
                valorAdicionalFinal = maiorValorAdicionalFinalGrupo1.efeito.valoresEfeitos.valorAdicional;
            }

            // Grupo 2
            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 4).forEach(efeitos => {
                valorBaseExtraFinal += efeitos.efeito.valoresEfeitos.valorBaseExtra;
                if (efeitos.efeito.valoresEfeitos.valorBaseExtra > 0) textos.push(`${efeitos.nomeModificador} - Valor Base +${efeitos.efeito.valoresEfeitos.valorBaseExtra}`);

                valorMultiplicadorFinal *= efeitos.efeito.valoresEfeitos.valorMultiplicador;
                if (efeitos.efeito.valoresEfeitos.valorMultiplicador !== 1) textos.push(`${efeitos.nomeModificador} - Valor Multiplicador *${efeitos.efeito.valoresEfeitos.valorMultiplicador}`);

                valorAdicionalFinal += efeitos.efeito.valoresEfeitos.valorAdicional;
                if (efeitos.efeito.valoresEfeitos.valorAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Adicional +${efeitos.efeito.valoresEfeitos.valorAdicional}`);
            });

            // Grupo 3
            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 5).forEach(efeitos => {
                valorBaseExtraFinal -= efeitos.efeito.valoresEfeitos.valorBaseExtra;
                if (efeitos.efeito.valoresEfeitos.valorBaseExtra > 0) textos.push(`${efeitos.nomeModificador} - Valor Base -${efeitos.efeito.valoresEfeitos.valorBaseExtra}`);
                
                valorMultiplicadorFinal *= (1 / efeitos.efeito.valoresEfeitos.valorMultiplicador);
                if (efeitos.efeito.valoresEfeitos.valorMultiplicador !== 1) textos.push(`${efeitos.nomeModificador} - Valor Multiplicador -*${efeitos.efeito.valoresEfeitos.valorMultiplicador}`);
                
                valorAdicionalFinal -= efeitos.efeito.valoresEfeitos.valorAdicional;
                if (efeitos.efeito.valoresEfeitos.valorAdicional > 0) textos.push(`${efeitos.nomeModificador} - Valor Adicional -${efeitos.efeito.valoresEfeitos.valorAdicional}`);
            });

            const valoresDaLinha = new ValoresEfeito({
                valorBaseExtra: valorBaseExtraFinal,
                valorMultiplicador: Math.round(valorMultiplicadorFinal * 10) / 10,
                valorAdicional: valorAdicionalFinal,
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

    get efeitos(): { aplicados: Efeito[], sobreescritos: Efeito[] } {
        const aplicados: Efeito[] = [];
        const sobreescritos: Efeito[] = [];

        //

        // const buffSobrecarga = this.prototipoSobrecarga();
        // if (buffSobrecarga) {
        //     aplicados.push(buffSobrecarga);
        // }

        //

        const groupedBuffs = this.modificadores.reduce((acc, modificador) => {
            const key = `${modificador.nome}-${modificador.codigoUnico}`;

            if (!acc[key]) acc[key] = [];

            acc[key].push(...modificador.efeitos);
            return acc;
        }, {} as Record<string, Efeito[]>);

        for (const key in groupedBuffs) {
            const buffs = groupedBuffs[key];
            const sortedBuffs = buffs.sort((a, b) => a.valoresEfeitos.valorAdicional - b.valoresEfeitos.valorAdicional);

            aplicados.push(sortedBuffs[0]);
            sobreescritos.push(...sortedBuffs.slice(1));
        }

        return { aplicados, sobreescritos };
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

    get teste(): string { return `Valor Base Extra: ${this.valoresEfeitos.valorBaseExtra}; Valor Multiplicador: ${this.valoresEfeitos.valorMultiplicador}; Valor Adicional ${this.valoresEfeitos.valorAdicional}`; }
    get valoresEstaVazio(): boolean { return (this.valoresEfeitos.valorBaseExtra === 0 && this.valoresEfeitos.valorMultiplicador === 1 && this.valoresEfeitos.valorAdicional === 0)}

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}
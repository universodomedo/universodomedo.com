// #region Imports
import { Efeito, Modificador, ValoresEfeito } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class ControladorModificadores {
    private _modificadores: Modificador[] = [];
    private _modificadoresTeste: Modificador[] = [
        new Modificador({nome: 'TesteAgilidade1', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 1, idTipoEfeito: 1, dadosValoresEfeitos: {valorAdicional: 3}}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        // new Modificador({nome: 'TesteDeslocamento1', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 1, dadosValoresEfeitos: {valorAdicional: 1}}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        // new Modificador({nome: 'TesteDeslocamento2', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 1, dadosValoresEfeitos: {valorAdicional: 2}}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento1', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 1, dadosValoresEfeitos: { valorBaseExtra: 10, valorMultiplicador: 1.5, valorAdicional: 5 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento2', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 1, dadosValoresEfeitos: { valorBaseExtra: 15, valorMultiplicador: 1.2, valorAdicional: 7 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento3', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 2, dadosValoresEfeitos: { valorBaseExtra: 12, valorMultiplicador: 2.0, valorAdicional: 6 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento4', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 2, dadosValoresEfeitos: { valorBaseExtra: 18, valorMultiplicador: 1.8, valorAdicional: 8 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento5', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseExtra: 20, valorMultiplicador: 1.4, valorAdicional: 10 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
        new Modificador({nome: 'TesteDeslocamento6', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{idLinhaEfeito: 53, idTipoEfeito: 5, dadosValoresEfeitos: { valorBaseExtra: 25, valorMultiplicador: 1.3, valorAdicional: 12 }}], dadosComportamentos: {dadosComportamentoPassivo: [false]}}),
    ];

    adicionaModificador(modificador: Modificador) {
        if (this.modificadores.some(modificadorAtual => modificadorAtual.codigoUnico === modificador.codigoUnico)) this.removeModificador(modificador);
        this._modificadores.push(modificador);
    }

    removeModificador(modificador: Modificador) { this._modificadores = this._modificadores.filter(modEquivalente => modEquivalente.codigoUnico !== modificador.codigoUnico); }
    valorPorIdLinhaEfeito(idLinhaEfeito: number): number { return this.efeitos.aplicados.filter(efeito => efeito.refLinhaEfeito.id === idLinhaEfeito)!.reduce((acc, cur) => acc + cur.valoresEfeitos.valorAdicional, 0); }
    valoresEfeitoPorLinhaEfeito(idLinhaEfeito: number): ValoresEfeito { return new ValoresEfeito({ valorBaseExtra: 2, valorMultiplicador: 1.1, valorAdicional: 0 }); }

    // valorMultiplicadorBuffPorId(idBuff: number): number { return this.buffs.aplicados }

    // prototipoSobrecarga():Buff|void {
    //     const personagem = getPersonagemFromContext();

    //     if (personagem.inventario.espacosUsados > personagem.estatisticasBuffaveis.espacoInventario.espacoTotal) {
    //         return new Buff(53, `Sobrecarga`, 0, 5, 0, 4, { dadosComportamentoAtivo: [] }, .5);
    //     }
    // }


    get modificadores(): Modificador[] { return this._modificadoresTeste; }

    agruparEfeitosPorLinha(): Record<number, Efeito[]> {
        const agrupados: Record<number, Efeito[]> = {};

        this.modificadores.forEach(modificador => {
            modificador.efeitos.forEach(efeito => {
                const idLinhaEfeito = efeito.refLinhaEfeito.id;

                if (!agrupados[idLinhaEfeito]) {
                    agrupados[idLinhaEfeito] = [];
                }

                agrupados[idLinhaEfeito].push(efeito);
            });
        });

        return agrupados;
    }

    calcularValoresPorLinha(): Record<number, ValoresEfeito> {
        const agrupados = this.agruparEfeitosPorLinha();
        const valoresPorLinha: Record<number, ValoresEfeito> = {};

        Object.entries(agrupados).forEach(([idLinhaEfeito, efeitos]) => {
            // Separar os efeitos em dois grupos
            const efeitosGrupo1 = efeitos.filter(efeito => [1, 2, 3].includes(efeito['_idTipoEfeito']));
            const efeitosGrupo2Tipo4 = efeitos.filter(efeito => efeito['_idTipoEfeito'] === 4);
            const efeitosGrupo2Tipo5 = efeitos.filter(efeito => efeito['_idTipoEfeito'] === 5);

            // Grupo 1: Calcular maiores valores por tipo e combiná-los
            let valorBaseExtraGrupo1 = 0;
            let valorMultiplicadorGrupo1 = 0;
            let valorAdicionalGrupo1 = 0;

            [1, 2, 3].forEach(tipo => {
                const efeitosDoTipo = efeitosGrupo1.filter(efeito => efeito['_idTipoEfeito'] === tipo);

                if (efeitosDoTipo.length > 0) {
                    valorBaseExtraGrupo1 += Math.max(...efeitosDoTipo.map(efeito => efeito.valoresEfeitos.valorBaseExtra));
                    valorMultiplicadorGrupo1 += Math.max(...efeitosDoTipo.map(efeito => efeito.valoresEfeitos.valorMultiplicador - 1));
                    valorAdicionalGrupo1 += Math.max(...efeitosDoTipo.map(efeito => efeito.valoresEfeitos.valorAdicional));
                }
            });

            // Grupo 2: Processar tipos 4 e 5 separadamente
            const valorBaseExtraGrupo2 = efeitosGrupo2Tipo4.reduce((acc, efeito) => acc + efeito.valoresEfeitos.valorBaseExtra, 0)
                                    - efeitosGrupo2Tipo5.reduce((acc, efeito) => acc + efeito.valoresEfeitos.valorBaseExtra, 0);

            const valorMultiplicadorGrupo2 = efeitosGrupo2Tipo4.reduce((acc, efeito) => acc + (efeito.valoresEfeitos.valorMultiplicador - 1), 0)
                                        - efeitosGrupo2Tipo5.reduce((acc, efeito) => acc + (efeito.valoresEfeitos.valorMultiplicador - 1), 0);

            const valorAdicionalGrupo2 = efeitosGrupo2Tipo4.reduce((acc, efeito) => acc + efeito.valoresEfeitos.valorAdicional, 0)
                                    - efeitosGrupo2Tipo5.reduce((acc, efeito) => acc + efeito.valoresEfeitos.valorAdicional, 0);

            // Combinar os dois grupos
            const valorBaseExtra = valorBaseExtraGrupo1 + valorBaseExtraGrupo2;
            let valorMultiplicador = Math.round((1 + valorMultiplicadorGrupo1 + valorMultiplicadorGrupo2) * 10) / 10;
            const valorAdicional = valorAdicionalGrupo1 + valorAdicionalGrupo2;

            // Criar o objeto ValoresEfeito para o idLinhaEfeito
            valoresPorLinha[+idLinhaEfeito] = new ValoresEfeito({
                valorBaseExtra,
                valorMultiplicador,
                valorAdicional,
            });
        });

        return valoresPorLinha;
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
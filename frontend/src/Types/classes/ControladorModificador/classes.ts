// #region Imports
import { Efeito, Modificador } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class ControladorModificadores {
    private _modificadores: Modificador[] = []

    adicionaModificador(modificador: Modificador) { this._modificadores.push(modificador); }
    removeModificador(modificador: Modificador) { this._modificadores = this._modificadores.filter(modEquivalente => modEquivalente.codigoUnico !== modificador.codigoUnico); }
    valorPorIdLinhaEfeito(idLinhaEfeito: number): number { return this.efeitos.aplicados.filter(efeito => efeito.refLinhaEfeito.id === idLinhaEfeito)!.reduce((acc, cur) => acc + cur.valor, 0); }
    // valorMultiplicadorBuffPorId(idBuff: number): number { return this.buffs.aplicados }

    // prototipoSobrecarga():Buff|void {
    //     const personagem = getPersonagemFromContext();

    //     if (personagem.inventario.espacosUsados > personagem.estatisticasBuffaveis.espacoInventario.espacoTotal) {
    //         return new Buff(53, `Sobrecarga`, 0, 5, 0, 4, { dadosComportamentoAtivo: [] }, .5);
    //     }
    // }


    get modificadores(): Modificador[] { return this._modificadores; }

    get efeitos(): { aplicados: Efeito[], sobreescritos: Efeito[] } {
        const aplicados: Efeito[] = [];
        const sobreescritos: Efeito[] = [];

        // const buffSobrecarga = this.prototipoSobrecarga();
        // if (buffSobrecarga) {
        //     aplicados.push(buffSobrecarga);
        // }

        const groupedBuffs = this._modificadores.reduce((acc, modificador) => {
            const key = `${modificador.nome}-${modificador.codigoUnico}`;

            if (!acc[key]) acc[key] = [];

            acc[key].push(...modificador.efeitos);
            return acc;
        }, {} as Record<string, Efeito[]>);

        for (const key in groupedBuffs) {
            const buffs = groupedBuffs[key];
            const sortedBuffs = buffs.sort((a, b) => b.valor - a.valor);

            aplicados.push(sortedBuffs[0]);
            sobreescritos.push(...sortedBuffs.slice(1));
        }

        return { aplicados, sobreescritos };
    }
}
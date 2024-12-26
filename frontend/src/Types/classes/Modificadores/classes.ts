// #region Imports
import { Buff } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class Modificadores {
    private _buffs: Buff[] = [];

    adicionaEfeito(buff: Buff) { this._buffs.push(buff); }
    removeEfeito(buff: Buff) { this._buffs = this._buffs.filter(buffEquivalente => buffEquivalente.codigoUnico !== buff.codigoUnico); }
    valorBuffPorId(idBuff: number): number { return this.buffs.aplicados.filter(buff => buff.refBuff.id === idBuff)!.reduce((acc, cur) => acc + cur.valor, 0); }
    // valorMultiplicadorBuffPorId(idBuff: number): number { return this.buffs.aplicados }

    prototipoSobrecarga():Buff|void {
        const personagem = getPersonagemFromContext();

        if (personagem.inventario.espacosUsados > personagem.estatisticasBuffaveis.espacoInventario.espacoTotal) {
            return new Buff(53, `Sobrecarga`, 0, 5, 0, 4, { dadosComportamentoAtivo: [] }, .5);
        }
    }

    get buffs(): { aplicados: Buff[], sobreescritos: Buff[] } {
        const aplicados: Buff[] = [];
        const sobreescritos: Buff[] = [];

        // const buffSobrecarga = this.prototipoSobrecarga();
        // if (buffSobrecarga) {
        //     aplicados.push(buffSobrecarga);
        // }

        const groupedBuffs = this._buffs.reduce((acc, buff) => {
            const key = `${buff['_idBuff']}-${buff['_idTipoBuff']}`;

            if (!acc[key]) acc[key] = [];

            acc[key].push(buff);
            return acc;
        }, {} as Record<string, Buff[]>);

        for (const key in groupedBuffs) {
            const buffs = groupedBuffs[key];
            const sortedBuffs = buffs.sort((a, b) => b.valor - a.valor);

            aplicados.push(sortedBuffs[0]);
            sobreescritos.push(...sortedBuffs.slice(1));
        }

        return { aplicados, sobreescritos };
    }
}
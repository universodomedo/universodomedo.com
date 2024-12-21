// #region Imports
import { Buff } from 'Types/classes/index.ts';
// #endregion

export class Modificadores {
    private _buffs: Buff[] = [];

    adicionaEfeito(buff: Buff) {
        this._buffs.push(buff);
    }

    removeEfeito(buff: Buff) {
        this._buffs = this._buffs.filter(buffEquivalente => buffEquivalente.codigoUnico !== buff.codigoUnico);
    }

    get buffs(): { aplicados: Buff[], sobreescritos: Buff[] } {
        const aplicados: Buff[] = [];
        const sobreescritos: Buff[] = [];

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

    valorBuffPorId(idBuff: number): number {
        return this.buffs.aplicados.filter(buff => buff.refBuff.id === idBuff)!.reduce((acc, cur) => acc + cur.valor, 0);
    }
}
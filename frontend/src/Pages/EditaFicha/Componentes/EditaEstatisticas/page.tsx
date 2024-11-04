// #region Imports
import style from './style.module.css';
import { useEffect } from 'react';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { GanhoIndividualNexEstatisticaFixa } from 'Types/classes/index.ts';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const ganhoEstatistica = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEstatisticaFixa)!;

    return (
        <div className={style.editando_ficha_estatisticas}>
        <div className={style.visualizador_estatistica}><h2>P.V.</h2><h2>{ganhosNex.pvAtualizado}</h2></div>
        <div className={style.visualizador_estatistica}><h2>P.S.</h2><h2>{ganhosNex.psAtualizado}</h2></div>
        <div className={style.visualizador_estatistica}><h2>P.E.</h2><h2>{ganhosNex.peAtualizado}</h2></div>
    </div>
    );
}

export default page;
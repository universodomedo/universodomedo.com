// #region Imports
import style from './style.module.css';

import { ContextoCriaRitualProvider, useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';
// #endregion

const page = () => {
    return (
        <ContextoCriaRitualProvider>
            <PageComContexto />
        </ContextoCriaRitualProvider>
    );
}

const PageComContexto = () => {
    const { paginaRitualAberta } = useContextoCriaRitual();

    return (
        <div className={style.recipiente_pagina_rituais}>
            {paginaRitualAberta}
        </div>
    );
};

export default page;
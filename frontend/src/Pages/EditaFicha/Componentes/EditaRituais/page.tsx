// #region Imports
import style from './style.module.css';

import { ContextoCriaRitualProvider, useContextoCriaRitual } from './contexto.tsx';
// #endregion

const page = () => {
    return (
        <ContextoCriaRitualProvider>
            <PageComContexto />
        </ContextoCriaRitualProvider>
    );
}

const PageComContexto = () => {
    const { paginasRituais, idPaginaRitualAberta } = useContextoCriaRitual();

    return (
        <div className={style.recipiente_pagina_rituais}>
            {paginasRituais[idPaginaRitualAberta]}
        </div>
    );
}

export default page;
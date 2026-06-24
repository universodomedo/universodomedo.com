'use client';

import { useContexto__PaginaConfigurarMusica__Edicao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';
import PainelClima from '../componentes/PainelClima/PainelClima';

export default function AbaClima() {
    const ctx = useContexto__PaginaConfigurarMusica__Edicao();

    return (
        <PainelClima climaItens={ctx.climaItens} dimensoesCatalogo={ctx.dimensoesCatalogo} onAdicionar={ctx.adicionarDimensaoClima} onSetNivel={ctx.setNivelClima} onRemover={ctx.removerDimensaoClima} />
    );
};

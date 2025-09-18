'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from "../componentes";
import { DashboardAovivo_Contexto } from './componentes';

export default function DashboardAovivo() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <DashboardAovivo_Contexto />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};
'use client';

import styles from './styles.module.css';

import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import { useLayoutContextualizado } from "Hooks/useLayoutContextualizado";
import { ListaMenusLayoutContextualizado } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';
import { AventuraEmLayoutContextualizado } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AventuraEmLayoutContextualizado/page';

export function AventurasMestre_Contexto() {
    const { aventurasFiltradas } = useContextoMestreAventuras();
    useLayoutContextualizado(ListaMenusLayoutContextualizado.menuPrincipalParaMestre, 'Mestre - Minhas Aventuras');

    return (
        <div id={styles.recipiente_aventuras_mestre}>
            {aventurasFiltradas!.map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} href={`/mestre/aventura/${grupoAventura.id}`} />)}
        </div>
    );
};
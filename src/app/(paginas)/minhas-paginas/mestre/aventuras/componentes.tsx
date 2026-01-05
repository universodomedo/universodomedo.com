'use client';

import styles from './styles.module.css';

import { MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import { AventuraEmLayoutContextualizado } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AventuraEmLayoutContextualizado/page';

export function AventurasMestre_Contexto() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo titulo={'Mestre - Minhas Aventuras'}>
                <AventurasMestre_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function AventurasMestre_Conteudo() {
    const { gruposAventurasListadas } = useContextoMestreAventuras();

    return (
        <div id={styles.recipiente_aventuras_mestre}>
            {gruposAventurasListadas!.map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} href={`/minhas-paginas/mestre/aventura/${grupoAventura.id}`} />)}
        </div>
    );
};
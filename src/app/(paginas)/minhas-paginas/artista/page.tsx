'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
// import ListaAcoesArtista from 'Componentes/ElementosDeMenu/ListaAcoesArtista/page';

export default function PaginaAdmin() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo>
                <></>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu><></>
                {/* <ListaAcoesArtista /> */}
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};
'use client';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaUplodImagemArtistaProvider } from 'Contextos/ContextoPaginaUplodImagemArtista/contexto';
import Uploader from 'Componentes/Elementos/Inputs/Uploader/Uploader';

export function PaginaArtista_AdicionarImagem_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.adicionarImagem}>
            <ContextoPaginaUplodImagemArtistaProvider>
                <Uploader />
            </ContextoPaginaUplodImagemArtistaProvider>
        </ControladorSlot>
    );
};
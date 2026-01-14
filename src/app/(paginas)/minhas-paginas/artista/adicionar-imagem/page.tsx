import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaUplodImagemArtistaProvider } from 'Contextos/ContextoPaginaUplodImagemArtista/contexto';
import { PaginaArtista_AdicionarImagem_Contexto } from "./componentes";

export default function PaginaArtista_AdicionarImagem() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.adicionarImagem}>
            <ContextoPaginaUplodImagemArtistaProvider>
                <PaginaArtista_AdicionarImagem_Contexto />
            </ContextoPaginaUplodImagemArtistaProvider>
        </ControladorSlot>
    );
};
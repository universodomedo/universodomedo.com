'use client';

import { PAGINAS, TIPOS_ARQUIVO } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";

export function PaginaArtista_AdicionarImagem_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.adicionarImagem}>
            <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.IMAGEM_ESPECIAL_ARTISTA} />
        </ControladorSlot>
    );
};
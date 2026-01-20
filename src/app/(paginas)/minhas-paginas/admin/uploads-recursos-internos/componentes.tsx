'use client';

import { PAGINAS, TIPOS_ARQUIVO } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";

export function PaginaUploadRecursosInternos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.uploadRecursosInternos}>
            <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.RECURSOS_INTERNOS} />
        </ControladorSlot>
    );
};
'use client';

import styles from './styles.module.css';

import { PAGINAS, TIPOS_ARQUIVO } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";

export function PaginaUploadRecursosInternos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.uploadRecursosInternos}>
            <div className={styles.recipiente_conteudo_pagina_upload_imagens_artista}>
                <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.RECURSOS_INTERNOS} />
            </div>
        </ControladorSlot>
    );
};
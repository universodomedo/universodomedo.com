'use client';

import styles from './styles.module.css';

import { PAGINAS, TIPOS_ARQUIVO } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";

export function PaginaUploadMusica_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.uploadMusica}>
            <div className={styles.recipiente_conteudo_pagina_upload_musica}>
                <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.MUSICA} />
            </div>
        </ControladorSlot>
    );
};
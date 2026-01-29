'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import RecipienteUploadArquivoImagemArtista from "Contextos/ContextoPaginaArtistaAdicionarImagem/contexto";

export function PaginaArtista_AdicionarImagem_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.adicionarImagem}>
            <div className={styles.recipiente_conteudo_pagina_upload_imagens_artista}>
                <RecipienteUploadArquivoImagemArtista />
            </div>
        </ControladorSlot>
    );
};
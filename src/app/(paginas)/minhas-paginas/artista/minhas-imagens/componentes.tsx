'use client';

import styles from './styles.module.css';

import { ArquivoCompletaDto, PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaArtistaMinhasImagensProvider, useContextoPaginaArtistaMinhasImagens } from "Contextos/ContextoPaginaArtistaMinhasImagens/contexto";
import RecipienteImagemPadrao from 'Uteis/ImagemLoader/RecipienteImagemPadrao';

export function PaginaArtista_MinhasImagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.minhasImagens}>
            <ContextoPaginaArtistaMinhasImagensProvider>
                <PaginaArtista_MinhasImagens_Contexto />
            </ContextoPaginaArtistaMinhasImagensProvider>
        </ControladorSlot>
    );
};

function PaginaArtista_MinhasImagens_Contexto() {
    const { arquivos } = useContextoPaginaArtistaMinhasImagens();

    return arquivos.length > 0
        ? (
            <div className={styles.recipiente_lista_arquivos}>
                {arquivos.map(arquivo => <RenderizaArquivo key={arquivo.id} arquivo={arquivo} />)}
            </div>
        )
        : (
            <h4>Nenhum Arquivo encontrado</h4>
        )
};

function RenderizaArquivo({ arquivo }: { arquivo: ArquivoCompletaDto }) {
    return (
        <div className={styles.recipiente_individual_item_arquivo}>
            <div className={styles.recipiente_area_render_arquivo}>
                <RecipienteImagemPadrao src={arquivo.caminhoArquivo} />
            </div>
        </div>
    );
};
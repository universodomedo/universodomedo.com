'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaArtistaMinhasImagensProvider, useContextoPaginaArtistaMinhasImagens } from "Contextos/ContextoPaginaArtistaMinhasImagens/contexto";
import RecipienteImagemPadrao from 'Uteis/ImagemLoader/RecipienteImagemPadrao';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

export default function PaginaArtista_MinhasImagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.minhasImagens}>
            <ContextoPaginaArtistaMinhasImagensProvider>
                <PaginaArtista_MinhasImagens_Contexto />
            </ContextoPaginaArtistaMinhasImagensProvider>
        </ControladorSlot>
    );
};

function PaginaArtista_MinhasImagens_Contexto() {
    const { listagemArquivos } = useContextoPaginaArtistaMinhasImagens();

    return (
        <ListagemComposta
            listagem={listagemArquivos}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={arquivo => arquivo.id}
            renderizarItem={arquivo => <RenderizaArquivo key={arquivo.id} caminhoArquivo={arquivo.caminhoArquivo} />}
        />
    );
};

function RenderizaArquivo({ caminhoArquivo }: { caminhoArquivo: string }) {
    return (
        <div className={styles.recipiente_individual_item_arquivo}>
            <div className={styles.recipiente_area_render_arquivo}>
                <RecipienteImagemPadrao src={caminhoArquivo} />
            </div>
        </div>
    );
};
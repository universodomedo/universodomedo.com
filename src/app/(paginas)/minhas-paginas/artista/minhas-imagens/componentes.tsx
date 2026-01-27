import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { useContextoPaginaArtistaMinhasImagens } from "Contextos/ContextoPaginaArtistaMinhasImagens/contexto";

export function PaginaArtista_MinhasImagens_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.minhasImagens}>
            <PaginaArtista_MinhasImagens_Contexto />
        </ControladorSlot>
    );
};

function PaginaArtista_MinhasImagens_Contexto() {
    return <h1>To do</h1>;
    // const { arquivos } = useContextoPaginaArtistaMinhasImagens();

    // return arquivos.length > 0
    //     ? (
    //         <div className={styles.recipiente_lista_arquivos}>
    //             {arquivos.map(arquivo => <RenderizaArquivo key={arquivo.id} arquivo={arquivo} />)}
    //         </div>
    //     )
    //     : (
    //         <h4>Nenhum Arquivo encontrado</h4>
    //     )
};
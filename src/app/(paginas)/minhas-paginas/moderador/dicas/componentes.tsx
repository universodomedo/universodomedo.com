import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { obtemPaginaWikiParaEdicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import EditorWiki from '../../../definicoes/editor/EditorWiki';
import SidebarWiki from '../../../definicoes/SidebarWiki';
import styles from '../../../definicoes/abasWiki.module.css';

const BASE_EDITOR = '/minhas-paginas/moderador/dicas';

export function EditorDicas_Client({ listaSlug }: { listaSlug: string[] }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.editorDicas}>
            <div className={styles.layout_leitura}>
                <SidebarWiki listaSlug={listaSlug} base={BASE_EDITOR} inicioLabel="+ Nova dica" inicioHref={BASE_EDITOR} secao="dica" titulo="Dicas" />
                <EditorDicas_Slot listaSlug={listaSlug} />
            </div>
        </ControladorSlot>
    );
};

async function EditorDicas_Slot({ listaSlug }: { listaSlug: string[] }) {
    const chave = listaSlug.length > 0 ? listaSlug.map(decodeURIComponent).join('/') : '';
    const inicial = chave ? await obtemPaginaWikiParaEdicao(chave, 'dica') : null;

    return <EditorWiki inicial={inicial ?? undefined} secao="dica" />;
};

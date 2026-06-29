import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { obtemPaginaWikiParaEdicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import EditorWiki from '../../../definicoes/editor/EditorWiki';
import SidebarWiki from '../../../definicoes/SidebarWiki';
import styles from '../../../definicoes/abasWiki.module.css';

const BASE_EDITOR = '/minhas-paginas/moderador/definicoes';

export function EditorDefinicoes_Client({ listaSlug }: { listaSlug: string[] }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.editorDefinicoes}>
            <div className={styles.layout_leitura}>
                <SidebarWiki listaSlug={listaSlug} base={BASE_EDITOR} inicioLabel="+ Nova página" inicioHref={BASE_EDITOR} />
                <EditorDefinicoes_Slot listaSlug={listaSlug} />
            </div>
        </ControladorSlot>
    );
};

async function EditorDefinicoes_Slot({ listaSlug }: { listaSlug: string[] }) {
    const chave = listaSlug.length > 0 ? listaSlug.map(decodeURIComponent).join('/') : '';
    const inicial = chave ? await obtemPaginaWikiParaEdicao(chave) : null;

    return <EditorWiki inicial={inicial ?? undefined} />;
};
'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ArquivoDto, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaSUDODeletarArquivosProvider, useContextoPaginaSUDODeletarArquivos } from 'Contextos/ContextoPaginaSUDODeletarArquivos/contexto';
import RecipienteImagemPadrao from 'Uteis/ImagemLoader/RecipienteImagemPadrao';

export function DeletarArquivos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.deletarArquivosFileServer}>
            <ContextoPaginaSUDODeletarArquivosProvider>
                <DeletarArquivos_Contexto />
            </ContextoPaginaSUDODeletarArquivosProvider>
        </ControladorSlot>
    );
};

function DeletarArquivos_Contexto() {
    const { arquivos } = useContextoPaginaSUDODeletarArquivos();

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

function RenderizaArquivo({ arquivo }: { arquivo: ArquivoDto }) {
    const { enviaDelete } = useContextoPaginaSUDODeletarArquivos();

    return (
        <div className={styles.recipiente_individual_item_arquivo}>
            <div className={styles.recipiente_area_render_arquivo}>
                <RecipienteImagemPadrao src={arquivo.caminhoArquivo} />
            </div>
            <button type="button" aria-label="Deletar arquivo" className={styles.botao_lixeira} onClick={() => enviaDelete(arquivo)}>
                <FontAwesomeIcon icon={faTrashCan} />
            </button>

            {arquivo.detalheArquivoInterno && (
                <div className={styles.recipiente_detalhes_arquivo}>
                    <h4>{arquivo.detalheArquivoInterno.nomeInterno}</h4>
                </div>
            )}
        </div>
    );
};
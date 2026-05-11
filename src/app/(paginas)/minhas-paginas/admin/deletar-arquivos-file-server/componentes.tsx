'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaSUDODeletarArquivosProvider, useContextoPaginaSUDODeletarArquivos } from 'Contextos/ContextoPaginaSUDODeletarArquivos/contexto';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import RecipienteImagemPadrao from 'Uteis/ImagemLoader/RecipienteImagemPadrao';

export default function DeletarArquivos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.deletarArquivosFileServer}>
            <ContextoPaginaSUDODeletarArquivosProvider>
                <DeletarArquivos_Contexto />
            </ContextoPaginaSUDODeletarArquivosProvider>
        </ControladorSlot>
    );
};

function DeletarArquivos_Contexto() {
    const { listagemArquivos } = useContextoPaginaSUDODeletarArquivos();

    return (
        <ListagemComposta
            listagem={listagemArquivos}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={grupoAventura => grupoAventura.id}
            renderizarItem={arquivo => <RenderizaArquivo key={arquivo.id} arquivo={arquivo} />}
        />
    );
};

function RenderizaArquivo({ arquivo }: { arquivo: ReturnType<typeof useContextoPaginaSUDODeletarArquivos>['listagemArquivos']['registros'][number] }) {
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
                    <h4 title={arquivo.detalheArquivoInterno.nomeInterno}>{arquivo.detalheArquivoInterno.nomeInterno}</h4>
                </div>
            )}
        </div>
    );
};
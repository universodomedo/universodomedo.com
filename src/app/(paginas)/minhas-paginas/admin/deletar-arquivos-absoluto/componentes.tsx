'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaSUDODeletarArquivosAbsolutoProvider, useContextoPaginaSUDODeletarArquivosAbsoluto } from 'Contextos/ContextoPaginaSUDODeletarArquivosAbsoluto/contexto';
import RecipienteAviso from 'Componentes/ElementosVisuais/RecipienteAviso/RecipienteAviso';

export function DeletarArquivosAbsoluto_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.deletarArquivosAbsoluto}>
            <ContextoPaginaSUDODeletarArquivosAbsolutoProvider>
                <DeletarArquivos_Contexto />
            </ContextoPaginaSUDODeletarArquivosAbsolutoProvider>
        </ControladorSlot>
    );
};

function DeletarArquivos_Contexto() {
    const { caminhoArquivo, onChangeCaminhoArquivo, podeExecutarDelete, executaDelete } = useContextoPaginaSUDODeletarArquivosAbsoluto();

    return (
        <>
            <RecipienteAviso tipo={'negativo'}>
                <h2>Atenção! Reconfirmar por conta e risco o arquivo a ser deletado</h2>

                <input className={styles.input_text} type="text" value={caminhoArquivo} onChange={onChangeCaminhoArquivo} placeholder="Ex: /RecursosInternos/.webp" />
            </RecipienteAviso>

            <button onClick={executaDelete} disabled={!podeExecutarDelete}>Deletar</button>
        </>
    );
};
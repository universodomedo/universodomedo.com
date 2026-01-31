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
    const { } = useContextoPaginaSUDODeletarArquivosAbsoluto();

    return (
        <RecipienteAviso tipo={'negativo'}>
            <h2>Atenção! Reconfirmar por conta e risco o arquivo a ser deletado</h2>


        </RecipienteAviso>
    );
};
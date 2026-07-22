'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaDocumentacaoProduto } from 'Conteineres/PaginaDocumentacaoProduto/conteiner';

export default function PaginaDocumentacaoProduto_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.colaborador.documentacaoDeProduto}>
            <Conteiner__PaginaDocumentacaoProduto />
        </ControladorSlot>
    );
};
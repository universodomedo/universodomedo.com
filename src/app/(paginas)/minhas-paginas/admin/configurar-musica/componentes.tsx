'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaConfigurarMusica } from 'Conteineres/PaginaConfigurarMusica/conteiner';

export default function PaginaConfigurarMusica_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.configurarMusica}>
            <Conteiner__PaginaConfigurarMusica />
        </ControladorSlot>
    );
};

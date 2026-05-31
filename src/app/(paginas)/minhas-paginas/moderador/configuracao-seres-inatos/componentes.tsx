'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorConfiguracaoSeresInatos from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/conteiner';

export default function PaginaModeradorConfiguracaoSeresInatos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.configuracaoSeresInatos}>
            <Conteiner__PaginaModeradorConfiguracaoSeresInatos />
        </ControladorSlot>
    );
};
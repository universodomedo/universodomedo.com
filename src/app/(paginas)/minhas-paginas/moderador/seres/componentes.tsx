import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorSeres from 'Conteineres/PaginaModeradorSeres/conteiner';

export default function PaginaModeradorSeres_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.seres}>
            <Conteiner__PaginaModeradorSeres />
        </ControladorSlot>
    );
};
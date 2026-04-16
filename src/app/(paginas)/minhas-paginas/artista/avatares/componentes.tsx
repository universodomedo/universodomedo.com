import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__GerenciarAvatares } from 'Conteineres/GerenciarAvatares/conteiner';

export default function GerenciarAvatares_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.avatares.gerenciarAvatares}>
            <Conteiner__GerenciarAvatares />
        </ControladorSlot>
    );
};
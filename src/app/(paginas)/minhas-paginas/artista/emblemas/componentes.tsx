import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__GerenciarEmblemas } from 'Conteineres/GerenciarEmblemas/conteiner';

export default function GerenciarEmblemas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.emblemas.uploadRecursosEmblemas}>
            <Conteiner__GerenciarEmblemas />
        </ControladorSlot>
    );
};
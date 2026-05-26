import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorHabilidadesPericia from 'Conteineres/PaginaModeradorHabilidadesPericia/conteiner';

export default function PaginaModeradorHabilidadesPericia_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.habilidadesPericia}>
            <Conteiner__PaginaModeradorHabilidadesPericia />
        </ControladorSlot>
    );
};
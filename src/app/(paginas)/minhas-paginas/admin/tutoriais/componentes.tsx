import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaAdminTutoriais from 'Conteineres/PaginaAdminTutoriais/conteiner';

export default function PaginaAdminTutoriais_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.tutoriais}>
            <Conteiner__PaginaAdminTutoriais />
        </ControladorSlot>
    );
};

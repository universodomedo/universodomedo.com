import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorHabilidadesEspeciais from 'Conteineres/PaginaModeradorHabilidadesEspeciais/conteiner';

export default function PaginaModeradorHabilidadesEspeciais_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.habilidadesEspeciais}>
            <Conteiner__PaginaModeradorHabilidadesEspeciais />
        </ControladorSlot>
    );
};

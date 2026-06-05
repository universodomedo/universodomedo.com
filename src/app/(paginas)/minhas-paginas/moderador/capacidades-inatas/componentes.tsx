import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorCapacidadesInatas from 'Conteineres/PaginaModeradorCapacidadesInatas/conteiner';

export default function PaginaModeradorCapacidadesInatas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.capacidadesInatas}>
            <Conteiner__PaginaModeradorCapacidadesInatas />
        </ControladorSlot>
    );
};
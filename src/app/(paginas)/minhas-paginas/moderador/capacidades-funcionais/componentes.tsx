import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorCapacidadesFuncionais from 'Conteineres/PaginaModeradorCapacidadesFuncionais/conteiner';

export default function PaginaModeradorCapacidadesFuncionais_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.capacidadesFuncionais}>
            <Conteiner__PaginaModeradorCapacidadesFuncionais />
        </ControladorSlot>
    );
};

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import Conteiner__PaginaModeradorEmblemas from "Conteineres/PaginaModeradorEmblemas/conteiner";

export default function PaginaModeradorEmblemas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.moderador.gerenciarEmblemas}>
            <Conteiner__PaginaModeradorEmblemas />
        </ControladorSlot>
    );
};
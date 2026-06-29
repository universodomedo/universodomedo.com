import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAssinaturaArtista } from 'Conteineres/PaginaAssinaturaArtista/conteiner';

export default function PaginaAssinaturaArtista_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.assinatura}>
            <Conteiner__PaginaAssinaturaArtista />
        </ControladorSlot>
    );
};

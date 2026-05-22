import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaArtistaInsignia } from 'Conteineres/PaginaArtistaInsignia/conteiner';

export default function PaginaArtistaInsignia_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.insignias.uploadRecursosInsignias}>
            <Conteiner__PaginaArtistaInsignia />
        </ControladorSlot>
    );
};
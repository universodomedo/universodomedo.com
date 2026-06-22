import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaColaboradorPainelDoMedo } from 'Conteineres/PaginaColaboradorPainelDoMedo/conteiner';

export default function PaginaColaboradorPainelDoMedo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.colaborador.painelDoMedo}>
            <Conteiner__PaginaColaboradorPainelDoMedo />
        </ControladorSlot>
    );
};

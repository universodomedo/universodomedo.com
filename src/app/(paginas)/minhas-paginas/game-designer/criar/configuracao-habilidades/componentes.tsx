import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaModeradorConfiguracaoHabilidades from 'Conteineres/PaginaModeradorConfiguracaoHabilidades/conteiner';

export default function PaginaModeradorConfiguracaoHabilidades_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.criar.configuracaoHabilidades}>
            <Conteiner__PaginaModeradorConfiguracaoHabilidades />
        </ControladorSlot>
    );
};
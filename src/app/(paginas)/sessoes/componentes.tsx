'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaSessoes from 'Conteineres/PaginaVisualizacaoSessoes/conteiner';

export default function PaginaSessoes_Conteiner({ idSessao }: { idSessao: number | null; }) {
    return (
        <ControladorSlot pagina={PAGINAS.sessoes}>
            <Conteiner__PaginaSessoes idSessaoInicial={idSessao} />
        </ControladorSlot>
    );
};
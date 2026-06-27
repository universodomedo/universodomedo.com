'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaGameDesignerCoeficientesGanhoEstatistica } from 'Conteineres/PaginaGameDesignerCoeficientesGanhoEstatistica/conteiner';

export default function PaginaGameDesignerCoeficientesGanhoEstatistica_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.gameDesigner.configurar.coeficientesGanhoEstatistica}>
            <Conteiner__PaginaGameDesignerCoeficientesGanhoEstatistica />
        </ControladorSlot>
    );
};

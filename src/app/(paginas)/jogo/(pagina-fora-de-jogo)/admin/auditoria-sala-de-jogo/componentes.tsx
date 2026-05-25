'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';
import { Conteiner__PaginaAdminAuditoriaSalaDeJogo } from 'Conteineres/PaginaAdminAuditoriaSalaDeJogo/conteiner';

export default function PaginaAdminAuditoriaSalaDeJogo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.admin.auditoriaSalaDeJogo} embrulho={JogoRouteGuard}>
            <Conteiner__PaginaAdminAuditoriaSalaDeJogo />
        </ControladorSlot>
    );
};
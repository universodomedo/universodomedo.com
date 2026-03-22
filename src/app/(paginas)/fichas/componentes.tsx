'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaFichasTemporariasProvider } from 'Contextos/ContextoPaginaFichasTemporarias/contexto';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';
import ListaAcoesFichas from 'Componentes/ElementosDeMenu/ListaAcoesFichas/ListaAcoesFichas';
import { Conteiner__PaginaFichasTemporarias } from 'Conteineres/PaginaFichasTemporarias/conteiner';

export default function PaginaFichas_Conteiner({ idFichaTemporaria }: { idFichaTemporaria: number | null; }) {
    function EmbrulhoFichasTemporarias({ children }: { children: React.ReactNode }) { return <ContextoPaginaFichasTemporariasProvider idFichaTemporariaInicial={idFichaTemporaria}>{children}</ContextoPaginaFichasTemporariasProvider> };

    return (
        <ControladorSlot pagina={PAGINAS.fichas} embrulho={EmbrulhoFichasTemporarias}>
            <Conteiner__PaginaFichasTemporarias />
            <RegistrarMenuLayoutDinamico node={<ListaAcoesFichas />} />
        </ControladorSlot>
    );
};
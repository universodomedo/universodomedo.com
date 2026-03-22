'use client';

import { PAGINAS } from 'types-nora-api';

import { ContextoPaginaAssistirProvider } from 'Contextos/ContextoPaginaAssistir/contexto';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAssistir } from 'Conteineres/PaginaAssistir/conteiner';
import { Conteiner__MenuAssistir } from 'Conteineres/MenuAssistir/conteiner';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';

export default function PaginaAssistir_Conteiner({ idAventura }: { idAventura: number | null; }) {
    function EmbrulhoAssistir({ children }: { children: React.ReactNode }) { return <ContextoPaginaAssistirProvider idAventuraInicial={idAventura}>{children}</ContextoPaginaAssistirProvider>; };

    return (
        <ControladorSlot pagina={PAGINAS.assistir} embrulho={EmbrulhoAssistir}>
            <Conteiner__PaginaAssistir />
            <RegistrarMenuLayoutDinamico node={<Conteiner__MenuAssistir />} />
        </ControladorSlot>
    );
};
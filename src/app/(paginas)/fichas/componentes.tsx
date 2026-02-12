'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaFichasProvider, useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';
import ListaAcoesFichas from 'Componentes/ElementosDeMenu/ListaAcoesFichas/ListaAcoesFichas';
import { SPA_PaginaFicha } from 'Contextos/ContextoPaginaFicha/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export function PaginaFichas_Client({ idFicha }: { idFicha: number | null; }) {
    function EmbrulhoFichas({ children }: { children: React.ReactNode }) { return <ContextoPaginaFichasProvider idFichaInicial={idFicha}>{children}</ContextoPaginaFichasProvider> };

    return (
        <ControladorSlot pagina={PAGINAS.fichas} embrulho={EmbrulhoFichas}>
            <PaginaFichas_Slot />
        </ControladorSlot>
    );
};

function PaginaFichas_Slot() {
    return (
        <>
            <PaginaFichas_Contexto />
            <RegistrarMenuLayoutDinamico node={<ListaAcoesFichas />} />
        </>
    );
};

function PaginaFichas_Contexto() {
    const { fichaSelecionada } = useContextoPaginaFichas();

    return fichaSelecionada ? <SPA_PaginaFicha /> : <SemFichaSelecionada />;
};

function SemFichaSelecionada() {
    useConfigurarLayoutContextualizado({ titulo: 'Minhas Fichas', proporcaoConteudo: 84 }, 'update');

    return <AvisosDePersonagensEFichas naoRenderizaAvisoPersonagem />;
};
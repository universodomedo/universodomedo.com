'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaAventuraProvider, useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import { PaginaAventura_Conteudo, PaginaAventura_Menu } from "./subcomponentes";
import { RegistrarMenuLayoutDinamico } from "Layouts/MenuLayoutDinamico";
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export function PaginaAventura_Client({ idGrupoAventura, indexEpisodio }: { idGrupoAventura: number, indexEpisodio: number | null }) {
    function EmbrulhoAventura({ children }: { children: React.ReactNode }) { return <ContextoPaginaAventuraProvider idGrupoAventura={idGrupoAventura} episodioIndexInicial={indexEpisodio}>{children}</ContextoPaginaAventuraProvider>; };

    return (
        <ControladorSlot pagina={PAGINAS.aventura} embrulho={EmbrulhoAventura}>
            <PaginaAventura_Layout />
        </ControladorSlot>
    );
};

function PaginaAventura_Layout() {
    const { grupoAventuraSelecionado } = useContextoPaginaAventura();
    useConfigurarLayoutContextualizado({ titulo: `Assistindo: ${grupoAventuraSelecionado.nomeUnicoGrupoAventura}` }, 'patch');

    return (
        <>
            <PaginaAventura_Conteudo />
            <RegistrarMenuLayoutDinamico node={<PaginaAventura_Menu />} />
        </>
    );
};
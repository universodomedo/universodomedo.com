'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaPersonagensProvider } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';
import ListaAcoesPersonagens from 'Componentes/ElementosDeMenu/ListaAcoesPersonagens/page';
import { Conteiner__PaginaPersonagens } from 'Conteineres/PaginaPersonagens/conteiner';

export default function PaginaPersonagens_Conteiner({ idPersonagem }: { idPersonagem: number | null; }) {
    function EmbrulhoPersonagens({ children }: { children: React.ReactNode }) { return <ContextoPaginaPersonagensProvider idPersonagemInicial={idPersonagem}>{children}</ContextoPaginaPersonagensProvider> };

    return (
        <ControladorSlot pagina={PAGINAS.personagens} embrulho={EmbrulhoPersonagens}>
            <Conteiner__PaginaPersonagens />
            <RegistrarMenuLayoutDinamico node={<ListaAcoesPersonagens />} />
        </ControladorSlot>
    );
};
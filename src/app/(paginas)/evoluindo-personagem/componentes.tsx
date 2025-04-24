'use client';

import { useContextoEvoluindoPersonagem } from './contexto.tsx';

export function PaginaEvoluindoPersonagem_Slot() {
    const { personagemEvoluindo } = useContextoEvoluindoPersonagem();

    return !personagemEvoluindo ? <PaginaListaPersonagensParaEvoluir /> : <PaginaEvolucaoPersonagem />
};

function PaginaListaPersonagensParaEvoluir() {
    const { listaPersonagensEvolucaoPendente } = useContextoEvoluindoPersonagem();

    if (!listaPersonagensEvolucaoPendente || listaPersonagensEvolucaoPendente.length < 1) return <div>Nenhum personagem pendente de evolução</div>;

    return <></>;
};

function PaginaEvolucaoPersonagem() {
    const { personagemEvoluindo } = useContextoEvoluindoPersonagem();

    return (
        <>
            <h1>{personagemEvoluindo?.informacao?.nome}</h1>
        </> 
    );
}
'use client';

import { useEffect } from 'react';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import PaginaPersonagensComDados from './page-dados.tsx';

import { ContextoPaginaPersonagemProvider, useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto.tsx';

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <PaginaMeusPersonagens />
        </ControladorSlot>
    );
};

export function PaginaMeusPersonagens() {
    return (
        <ContextoPaginaPersonagemProvider>
            <PaginaMeusPersonagensComContexto />
        </ContextoPaginaPersonagemProvider>
    );
};

function PaginaMeusPersonagensComContexto() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return personagemSelecionado === undefined ? <PaginaListaPersonagens /> : <PaginaPersonagemSelecionado />
};

function PaginaListaPersonagens() {
    const { carregando, listaPersonagens, buscaTodosPersonagensUsuario } = useContextoPaginaPersonagem();

    useEffect(() => {
        buscaTodosPersonagensUsuario();
    }, []);

    if (carregando) return <div>Carregando personagens</div>;

    if (listaPersonagens === undefined) return <div>Erro ao carregar personagens</div>;

    return <PaginaPersonagensComDados />
};

function PaginaPersonagemSelecionado() {
    const { carregando, personagemSelecionado } = useContextoPaginaPersonagem();

    if (carregando) return <div>Carregando personagem</div>;

    if (personagemSelecionado === undefined) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados />
};

function PaginaPersonagemComDados() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return <h1>{personagemSelecionado?.informacao?.nome}</h1>
}
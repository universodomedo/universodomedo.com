'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaFichasProvider, useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';
import ListaAcoesFichas from 'Componentes/ElementosDeMenu/ListaAcoesFichas/ListaAcoesFichas';
import { SPA_PaginaFicha } from 'Contextos/ContextoPaginaFicha/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export function PaginaFichas_Client({ idFicha }: { idFicha: number | null; }) {
    function EmbrulhoFichas({ children }: { children: React.ReactNode }) { return <ContextoPaginaFichasProvider idFichaInicial={idFicha}>{children}</ContextoPaginaFichasProvider> };

    return (
        <ControladorSlot pagina={PAGINAS.fichas} embrulho={EmbrulhoFichas}>
            <PaginaFichas_Slot />
        </ControladorSlot>
    );
};

function PaginaFichas_Slot() {
    useConfigurarLayoutContextualizado({ fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.jogador, tituloTooltip: 'Voltar para Página de Jogador' } }, 'patch');
    
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
    const { fichasTemporarias } = useContextoPaginaFichas();
    // useConfigurarLayoutContextualizado({ titulo: 'Minhas Fichas', proporcaoConteudo: 84 }, 'update');

    return (
        <div className={styles.recipiente_conteudo_pagina_fichas}>
            <AvisosDePersonagensEFichas naoRenderizaAvisoPersonagem naoRenderizaLinkFicha />

            {fichasTemporarias.length < 1 ? <ConteudoSemFicha /> : <ConteudoComFicha />}
        </div>
    );
};

function ConteudoSemFicha() {
    return (
        <div className={styles.recipiente_botao_criar_fichas}>
            <CustomLink destino={{ pagina: PAGINAS.minhasPaginas.jogador.criar.ficha }} className={styles.botao_criar_ficha}>
                <h2>Criar Nova Ficha</h2>
                <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__BOTAO_MISSAO'} />
            </CustomLink>
        </div>
    );
};

function ConteudoComFicha() {
    return (
        <>
            <h1>Para acessar sua Ficha, selecione no menu lateral ao lado</h1>
            <h2>Para cadastrar uma nova, delete a anterior ou obtenha o <LinkInterno destino={{ pagina: PAGINAS.minhasPaginas.minhasConfiguracoes.passeDeJogador }}>Passe de Jogador</LinkInterno></h2>
        </>
    );
};
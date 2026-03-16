import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada } from 'Contextos/ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada() {
    const { fichasTemporarias } = useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada();

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
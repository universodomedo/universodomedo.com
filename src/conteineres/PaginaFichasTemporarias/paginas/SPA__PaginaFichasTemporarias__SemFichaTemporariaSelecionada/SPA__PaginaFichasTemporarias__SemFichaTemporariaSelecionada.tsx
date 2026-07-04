import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada } from 'Contextos/ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada() {
    const { podeCriarNovaFicha, temAlgumaFicha, consideraPasseFundador, temPasseFundador, ehColaborador } = useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada();

    return (
        <div className={styles.recipiente_conteudo_pagina_fichas}>
            <AvisosDePersonagensEFichas naoRenderizaAvisoPersonagem naoRenderizaLinkFicha />

            {/* inicio confirmação visual de teste */}
            {/* <div>
                <p>Pode criar ficha? <IndicadorBooleano valor={podeCriarNovaFicha} /></p>
                <p>Tem alguma ficha? <IndicadorBooleano valor={temAlgumaFicha} /></p>
                <p>Considerado Passe de Fundador? <IndicadorBooleano valor={consideraPasseFundador} /></p>
                <p>É Colaborador? <IndicadorBooleano valor={ehColaborador} /></p>
                <p>Tem Passe de Fundador? <IndicadorBooleano valor={temPasseFundador} /></p>
            </div> */}
            {/* fim confirmação visual de teste */}

            {podeCriarNovaFicha ? <ConteudoParaCriarNovaFicha /> : <ConteudoComLimiteDeFichasAtingido />}
        </div>
    );
};

// function IndicadorBooleano({ valor }: { valor: boolean }) {
//     return valor ? <IndicadorBooleanoPositivo /> : <IndicadorBooleanoNegativo />;
// };

// function IndicadorBooleanoPositivo() {
//     return <span className={styles.teste_positivo}>SIM</span>;
// };

// function IndicadorBooleanoNegativo() {
//     return <span className={styles.teste_negativo}>NÃO</span>;
// };

function ConteudoParaCriarNovaFicha() {
    return (
        <div className={styles.recipiente_botao_criar_fichas}>
            <CustomLink destino={{ pagina: PAGINAS.minhasPaginas.jogador.criar.ficha }} className={styles.botao_criar_ficha}>
                <h2>Criar Nova Ficha</h2>
                <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__BOTAO_MISSAO'} />
            </CustomLink>
        </div>
    );
};

function ConteudoComLimiteDeFichasAtingido() {
    return (
        <>
            <h1>Para acessar sua Ficha, selecione no menu lateral ao lado</h1>
            <h2>Para cadastrar uma nova, delete a anterior ou obtenha o <LinkInterno destino={{ pagina: PAGINAS.minhasPaginas.minhasConfiguracoes.minhaConta }}>Passe de Fundador</LinkInterno></h2>
        </>
    );
};
'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaDocumentacaoProduto__Props } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Mapa from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Mapa/SPA__PaginaDocumentacaoProduto__Mapa';

type Contexto__PaginaDocumentacaoProduto__Mapa__Props = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemPaginas' | 'listagemLigacoes' | 'listagemPosicoes' | 'estaDocumentada' | 'selecionarPagina' | 'criarLigacao' | 'removerLigacao' | 'definirPosicao'>;

type PropsProvider = Contexto__PaginaDocumentacaoProduto__Mapa__Props & { fecharMapa: () => void };

const Contexto__PaginaDocumentacaoProduto__Mapa = createContext<Contexto__PaginaDocumentacaoProduto__Mapa__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Mapa = (): Contexto__PaginaDocumentacaoProduto__Mapa__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Mapa);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Mapa precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Mapa');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Mapa__Provider = ({ fecharMapa, ...props }: PropsProvider) => {
    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica o mapa; o X volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Mapa de Navegação',
        fecharProps: { tipo: 'acao', executar: fecharMapa, tituloTooltip: 'Voltar para a listagem' },
    });

    return (
        <Contexto__PaginaDocumentacaoProduto__Mapa.Provider value={props}>
            <SPA__PaginaDocumentacaoProduto__Mapa />
        </Contexto__PaginaDocumentacaoProduto__Mapa.Provider>
    );
};
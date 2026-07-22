import styles from './styles.module.css';

import classNames from 'classnames';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaDocumentacaoProduto__Listagem } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Listagem/contexto';
import type { RegistroPaginaParaDocumentar } from 'Contextos/Contexto__PaginaDocumentacaoProduto/contexto';

export default function SPA__PaginaDocumentacaoProduto__Listagem() {
    const { listagemPaginas, estaDocumentada, selecionarPagina, abrirCatalogo, abrirMapa, abrirJornadas, abrirEdicao, abrirCtas } = useContexto__PaginaDocumentacaoProduto__Listagem();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <ListagemComposta
                    listagem={listagemPaginas}
                    modoExibicao={ListagemCompostaModoExibicao.GRADE}
                    itensPorLinha={5}
                    obterIdRegistro={pagina => pagina.id}
                    renderizarItem={pagina => <CartaoPagina pagina={pagina} documentada={estaDocumentada(pagina.id)} aoSelecionar={selecionarPagina} />}
                />
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={abrirCatalogo}>Personas & Necessidades</button>
                <button type="button" data-variante="secundario" onClick={abrirMapa}>Mapa de Navegação</button>
                <button type="button" data-variante="secundario" onClick={abrirJornadas}>Jornadas</button>
                <button type="button" data-variante="secundario" onClick={abrirCtas}>CTAs & Seções</button>
                <button type="button" data-variante="secundario" onClick={abrirEdicao}>Exportar PDF</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

// Cartão de uma página real: identidade + o estado central do módulo — documentada ou espaço em branco no mapa.
function CartaoPagina({ pagina, documentada, aoSelecionar }: { pagina: RegistroPaginaParaDocumentar; documentada: boolean; aoSelecionar: (pagina: RegistroPaginaParaDocumentar) => void; }) {
    return (
        <DivClicavel className={classNames(styles.cartao_pagina, { [styles.inativa]: !pagina.ativo })} onClick={() => aoSelecionar(pagina)}>
            <strong className={styles.nome}>{pagina.label}</strong>
            <span className={styles.rota}>{pagina.template}</span>
            <span className={classNames(styles.estado, { [styles.documentada]: documentada })}>{documentada ? 'Documentada' : 'Sem documentação'}</span>
        </DivClicavel>
    );
};
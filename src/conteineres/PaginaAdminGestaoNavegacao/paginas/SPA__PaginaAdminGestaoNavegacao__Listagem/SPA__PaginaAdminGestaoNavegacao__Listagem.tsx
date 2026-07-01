import styles from './styles.module.css';

import classNames from 'classnames';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContexto__PaginaAdminGestaoNavegacao__Listagem } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__Listagem/contexto';
import type { RegistroPaginaNavegacao } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';

export default function SPA__PaginaAdminGestaoNavegacao__Listagem() {
    const { listagemPaginas, selecionarPagina } = useContexto__PaginaAdminGestaoNavegacao__Listagem();

    return (
        <ListagemComposta
            listagem={listagemPaginas}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={5}
            obterIdRegistro={pagina => pagina.id}
            renderizarItem={pagina => <LinhaPagina pagina={pagina} aoSelecionar={selecionarPagina} />}
        />
    );
};

function LinhaPagina({ pagina, aoSelecionar }: { pagina: RegistroPaginaNavegacao; aoSelecionar: (pagina: RegistroPaginaNavegacao) => void; }) {
    return (
        <DivClicavel className={classNames(styles.linha_pagina, { [styles.inativa]: !pagina.ativo })} onClick={() => aoSelecionar(pagina)}>
            <strong className={styles.nome}>{pagina.label}</strong>
            <span className={styles.chave}>{pagina.chave}</span>
        </DivClicavel>
    );
};
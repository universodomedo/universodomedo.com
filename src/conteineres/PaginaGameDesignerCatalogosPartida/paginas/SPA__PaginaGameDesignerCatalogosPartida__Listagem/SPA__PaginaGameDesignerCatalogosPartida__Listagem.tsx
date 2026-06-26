import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerCatalogosPartida__Listagem } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Listagem/contexto';
import type { CatalogoPartidaResumo } from 'types-nora-api';

export default function SPA__PaginaGameDesignerCatalogosPartida__Listagem() {
    const { listagemCatalogos, iniciaCadastro } = useContexto__PaginaGameDesignerCatalogosPartida__Listagem();

    return (
        <ListagemComposta
            listagem={listagemCatalogos}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={catalogo => catalogo.id}
            renderizarItem={catalogo => <RenderizaRegistroCatalogo catalogo={catalogo} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Catálogo' }}
        />
    );
};

function RenderizaRegistroCatalogo({ catalogo }: { catalogo: CatalogoPartidaResumo; }) {
    const { selecionaCatalogo } = useContexto__PaginaGameDesignerCatalogosPartida__Listagem();

    return (
        <button type="button" className={styles.registro} onClick={() => selecionaCatalogo(catalogo.id)}>
            <strong className={styles.nome}>{catalogo.nome}</strong>
            <span className={catalogo.ativo ? styles.selo_ativo : styles.selo_inativo}>{catalogo.ativo ? 'Ativo' : 'Inativo'}</span>
        </button>
    );
};

import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerCatalogosMissao__Listagem } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissao__Listagem/contexto';

type RegistroCatalogoMissao = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosMissao__Listagem>['listagemCatalogosMissao']['registros'][number];

export default function SPA__PaginaGameDesignerCatalogosMissao__Listagem() {
    const { listagemCatalogosMissao, iniciaCriacao, iniciaEdicao, removerCatalogo } = useContexto__PaginaGameDesignerCatalogosMissao__Listagem();

    return (
        <ListagemComposta
            listagem={listagemCatalogosMissao}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={catalogo => catalogo.id}
            renderizarItem={catalogo => <LinhaCatalogoMissao catalogo={catalogo} aoEditar={iniciaEdicao} aoRemover={removerCatalogo} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCriacao, textoBotao: 'Novo Catálogo' }}
        />
    );
};

function LinhaCatalogoMissao({ catalogo, aoEditar, aoRemover }: { catalogo: RegistroCatalogoMissao; aoEditar: (catalogo: RegistroCatalogoMissao) => void; aoRemover: (catalogo: RegistroCatalogoMissao) => Promise<void>; }) {
    return (
        <article className={styles.linha_catalogo}>
            <div className={styles.dados_catalogo}>
                <strong className={styles.nome_catalogo}>{catalogo.nome}</strong>
                <span className={styles.meta_catalogo}>ID {catalogo.id}</span>
            </div>
            <span className={styles.data_catalogo}>{formataData(catalogo.dataAtualizacao)}</span>
            <div className={styles.acoes_catalogo}>
                <button type="button" className={styles.botao_secundario} onClick={() => aoEditar(catalogo)}>Editar</button>
                <button type="button" className={styles.botao_perigo} onClick={() => void aoRemover(catalogo)}>Remover</button>
            </div>
        </article>
    );
};

function formataData(data: Date | string): string { return new Date(data).toLocaleString('pt-BR'); };
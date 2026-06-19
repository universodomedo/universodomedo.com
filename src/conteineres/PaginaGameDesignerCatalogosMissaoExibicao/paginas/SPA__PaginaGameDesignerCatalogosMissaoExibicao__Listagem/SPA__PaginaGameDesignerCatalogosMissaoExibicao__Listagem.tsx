import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem/contexto';

type RegistroCatalogoMissao = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem>['listagemCatalogosMissao']['registros'][number];
type RegistroCatalogoMissaoExibicao = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem>['listagemCatalogosMissaoExibicao']['registros'][number];

export default function SPA__PaginaGameDesignerCatalogosMissaoExibicao__Listagem() {
    const { listagemCatalogosMissao, listagemCatalogosMissaoExibicao, iniciaConfiguracao } = useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem();

    function obterExibicao(catalogo: RegistroCatalogoMissao): RegistroCatalogoMissaoExibicao | null {
        return listagemCatalogosMissaoExibicao.registros.find(exibicao => exibicao.fkCatalogosMissaoId === catalogo.id) ?? null;
    };

    return (
        <ListagemComposta
            listagem={listagemCatalogosMissao}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={catalogo => catalogo.id}
            renderizarItem={catalogo => <LinhaCatalogoMissaoExibicao catalogo={catalogo} exibicao={obterExibicao(catalogo)} aoConfigurar={iniciaConfiguracao} />}
        />
    );
};

function LinhaCatalogoMissaoExibicao({ catalogo, exibicao, aoConfigurar }: { catalogo: RegistroCatalogoMissao; exibicao: RegistroCatalogoMissaoExibicao | null; aoConfigurar: (catalogo: RegistroCatalogoMissao, exibicao: RegistroCatalogoMissaoExibicao | null) => void; }) {
    return (
        <article className={styles.linha_configuracao}>
            <div className={styles.dados_configuracao}>
                <strong className={styles.nome_configuracao}>{catalogo.nome}</strong>
                <span className={styles.meta_configuracao}>ID {catalogo.id}</span>
            </div>
            <span className={exibicao?.ativo ? styles.status_ativo : styles.status_inativo}>{exibicao?.ativo ? 'Ativo' : 'Inativo'}</span>
            <span className={styles.ordem_configuracao}>Ordem {exibicao?.ordem ?? '-'}</span>
            <button type="button" className={styles.botao_secundario} onClick={() => aoConfigurar(catalogo, exibicao)}>Configurar</button>
        </article>
    );
};

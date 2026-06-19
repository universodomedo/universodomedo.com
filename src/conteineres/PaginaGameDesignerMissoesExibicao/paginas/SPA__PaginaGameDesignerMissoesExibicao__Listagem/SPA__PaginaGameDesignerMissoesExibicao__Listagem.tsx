import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerMissoesExibicao__Listagem } from 'Contextos/Contexto__PaginaGameDesignerMissoesExibicao__Listagem/contexto';

type RegistroMissao = ReturnType<typeof useContexto__PaginaGameDesignerMissoesExibicao__Listagem>['listagemMissoes']['registros'][number];
type RegistroMissaoDetalhe = ReturnType<typeof useContexto__PaginaGameDesignerMissoesExibicao__Listagem>['listagemMissoesDetalhes']['registros'][number];
type RegistroMissaoExibicao = ReturnType<typeof useContexto__PaginaGameDesignerMissoesExibicao__Listagem>['listagemMissoesExibicao']['registros'][number];
type RegistroCatalogoMissao = ReturnType<typeof useContexto__PaginaGameDesignerMissoesExibicao__Listagem>['listagemCatalogosMissao']['registros'][number];

export default function SPA__PaginaGameDesignerMissoesExibicao__Listagem() {
    const { listagemMissoes, listagemMissoesDetalhes, listagemMissoesExibicao, listagemCatalogosMissao, iniciaConfiguracao } = useContexto__PaginaGameDesignerMissoesExibicao__Listagem();

    function obterDetalhe(missao: RegistroMissao): RegistroMissaoDetalhe | null {
        return listagemMissoesDetalhes.registros.find(detalhe => detalhe.fkMissoesId === missao.id) ?? null;
    };

    function obterExibicao(missao: RegistroMissao): RegistroMissaoExibicao | null {
        return listagemMissoesExibicao.registros.find(exibicao => exibicao.fkMissoesId === missao.id) ?? null;
    };

    function obterCatalogo(exibicao: RegistroMissaoExibicao | null): RegistroCatalogoMissao | null {
        if (!exibicao) return null;

        return listagemCatalogosMissao.registros.find(catalogo => catalogo.id === exibicao.fkCatalogosMissaoId) ?? null;
    };

    return (
        <ListagemComposta
            listagem={listagemMissoes}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={missao => missao.id}
            renderizarItem={missao => {
                const detalhe = obterDetalhe(missao);
                const exibicao = obterExibicao(missao);

                return <LinhaMissaoExibicao missao={missao} detalhe={detalhe} exibicao={exibicao} catalogo={obterCatalogo(exibicao)} aoConfigurar={iniciaConfiguracao} />;
            }}
        />
    );
};

function LinhaMissaoExibicao({ missao, detalhe, exibicao, catalogo, aoConfigurar }: { missao: RegistroMissao; detalhe: RegistroMissaoDetalhe | null; exibicao: RegistroMissaoExibicao | null; catalogo: RegistroCatalogoMissao | null; aoConfigurar: (missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null, exibicao: RegistroMissaoExibicao | null) => void; }) {
    return (
        <article className={styles.linha_configuracao}>
            <div className={styles.dados_configuracao}>
                <strong className={styles.nome_configuracao}>{detalhe?.nome ?? `Missão #${missao.id}`}</strong>
                <span className={styles.meta_configuracao}>{catalogo?.nome ?? 'Sem catálogo configurado'}</span>
            </div>
            <span className={exibicao?.ativo ? styles.status_ativo : styles.status_inativo}>{exibicao?.ativo ? 'Ativa' : 'Inativa'}</span>
            <span className={styles.ordem_configuracao}>Ordem {exibicao?.ordem ?? '-'}</span>
            <button type="button" className={styles.botao_secundario} onClick={() => aoConfigurar(missao, detalhe, exibicao)}>Configurar</button>
        </article>
    );
};

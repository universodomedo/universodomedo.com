import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerMissoesDetalhes__Listagem } from 'Contextos/Contexto__PaginaGameDesignerMissoesDetalhes__Listagem/contexto';

type RegistroMissao = ReturnType<typeof useContexto__PaginaGameDesignerMissoesDetalhes__Listagem>['listagemMissoes']['registros'][number];
type RegistroMissaoDetalhe = ReturnType<typeof useContexto__PaginaGameDesignerMissoesDetalhes__Listagem>['listagemMissoesDetalhes']['registros'][number];

export default function SPA__PaginaGameDesignerMissoesDetalhes__Listagem() {
    const { listagemMissoes, listagemMissoesDetalhes, iniciaConfiguracao } = useContexto__PaginaGameDesignerMissoesDetalhes__Listagem();

    function obterDetalhe(missao: RegistroMissao): RegistroMissaoDetalhe | null {
        return listagemMissoesDetalhes.registros.find(detalhe => detalhe.fkMissoesId === missao.id) ?? null;
    };

    return (
        <ListagemComposta
            listagem={listagemMissoes}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={missao => missao.id}
            renderizarItem={missao => <LinhaMissaoDetalhe missao={missao} detalhe={obterDetalhe(missao)} aoConfigurar={iniciaConfiguracao} />}
        />
    );
};

function LinhaMissaoDetalhe({ missao, detalhe, aoConfigurar }: { missao: RegistroMissao; detalhe: RegistroMissaoDetalhe | null; aoConfigurar: (missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null) => void; }) {
    return (
        <article className={styles.linha_configuracao}>
            <div className={styles.dados_configuracao}>
                <strong className={styles.nome_configuracao}>{detalhe?.nome ?? `Missão #${missao.id}`}</strong>
                <span className={styles.meta_configuracao}>{detalhe ? detalhe.descricao : 'Sem detalhe editorial configurado'}</span>
            </div>
            <span className={styles.id_configuracao}>ID {missao.id}</span>
            <button type="button" className={styles.botao_secundario} onClick={() => aoConfigurar(missao, detalhe)}>Configurar</button>
        </article>
    );
};

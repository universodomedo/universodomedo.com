import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerMissoes__Listagem } from 'Contextos/Contexto__PaginaGameDesignerMissoes__Listagem/contexto';

type RegistroMissao = ReturnType<typeof useContexto__PaginaGameDesignerMissoes__Listagem>['listagemMissoes']['registros'][number];

export default function SPA__PaginaGameDesignerMissoes__Listagem() {
    const { listagemMissoes, criandoMissao, criarMissao, removerMissao } = useContexto__PaginaGameDesignerMissoes__Listagem();

    return (
        <ListagemComposta
            listagem={listagemMissoes}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={missao => missao.id}
            renderizarItem={missao => <LinhaMissao missao={missao} aoRemover={removerMissao} />}
            novoRegistro={{ estaEmProcessoCriacao: criandoMissao, aoIniciarCriacao: () => void criarMissao(), textoBotao: 'Nova Missão', textoEmProcesso: 'Criando Missão' }}
        />
    );
};

function LinhaMissao({ missao, aoRemover }: { missao: RegistroMissao; aoRemover: (missao: RegistroMissao) => Promise<void>; }) {
    return (
        <article className={styles.linha_missao}>
            <div className={styles.dados_missao}>
                <strong className={styles.nome_missao}>Missão #{missao.id}</strong>
                <span className={styles.meta_missao}>Raiz jogável sem detalhe editorial nesta tabela</span>
            </div>
            <span className={styles.data_missao}>{formataData(missao.dataCriacao)}</span>
            <button type="button" className={styles.botao_perigo} onClick={() => void aoRemover(missao)}>Remover</button>
        </article>
    );
};

function formataData(data: Date | string): string { return new Date(data).toLocaleString('pt-BR'); };
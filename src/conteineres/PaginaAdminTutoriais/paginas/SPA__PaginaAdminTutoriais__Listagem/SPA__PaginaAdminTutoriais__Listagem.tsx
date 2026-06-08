import styles from './styles.module.css';

import { pluralize } from 'types-nora-api';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaAdminTutoriais__Listagem } from 'Contextos/Contexto__PaginaAdminTutoriais__Listagem/contexto';

type RegistroTutorial = ReturnType<typeof useContexto__PaginaAdminTutoriais__Listagem>['listagemTutoriais']['registros'][number];

export default function SPA__PaginaAdminTutoriais__Listagem() {
    const { listagemTutoriais, iniciaCriacao, iniciaEdicao } = useContexto__PaginaAdminTutoriais__Listagem();

    return (
        <ListagemComposta
            listagem={listagemTutoriais}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={tutorial => tutorial.id}
            renderizarItem={tutorial => <LinhaTutorial tutorial={tutorial} aoEditar={iniciaEdicao} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCriacao, textoBotao: 'Novo Tutorial' }}
        />
    );
};

function LinhaTutorial({ tutorial, aoEditar }: { tutorial: RegistroTutorial; aoEditar: (id: number) => void; }) {
    return (
        <article className={styles.linha_tutorial}>
            <div className={styles.dados}>
                <strong className={styles.nome}>{tutorial.nome}</strong>
                <span className={styles.chave}>{tutorial.chaveTutorial}</span>
            </div>
            <span className={tutorial.ativo ? styles.status_ativo : styles.status_inativo}>{tutorial.ativo ? 'Ativo' : 'Inativo'}</span>
            <span className={styles.passos}>{tutorial.quantidadePassos} {pluralize(tutorial.quantidadePassos, 'passo')}</span>
            <button type="button" className={styles.botao_editar} onClick={() => aoEditar(tutorial.id)}>Editar</button>
        </article>
    );
};

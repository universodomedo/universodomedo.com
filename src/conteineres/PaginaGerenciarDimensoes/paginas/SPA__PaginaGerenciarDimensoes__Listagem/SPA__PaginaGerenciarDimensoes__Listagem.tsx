import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGerenciarDimensoes__Listagem } from 'Contextos/Contexto__PaginaGerenciarDimensoes__Listagem/contexto';

type RegistroDimensao = ReturnType<typeof useContexto__PaginaGerenciarDimensoes__Listagem>['listagemDimensoes']['registros'][number];

export default function SPA__PaginaGerenciarDimensoes__Listagem() {
    const { listagemDimensoes, iniciaCriacao } = useContexto__PaginaGerenciarDimensoes__Listagem();

    return (
        <ListagemComposta
            listagem={listagemDimensoes}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={dimensao => dimensao.id}
            renderizarItem={dimensao => <CardDimensao dimensao={dimensao} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCriacao, textoBotao: 'Nova Dimensão' }}
        />
    );
};

function CardDimensao({ dimensao }: { dimensao: RegistroDimensao; }) {
    return (
        <article className={styles.card_dimensao}>
            <span className={styles.polos}>{dimensao.bipolar ? `${dimensao.rotuloOposto} ⟷ ${dimensao.nome}` : dimensao.nome}</span>
        </article>
    );
};

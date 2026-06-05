import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorCapacidadesInatas__Listagem } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas__Listagem/contexto';

type RegistroCapacidadeInata = ReturnType<typeof useContexto__PaginaModeradorCapacidadesInatas__Listagem>['listagemCapacidadesInatas']['registros'][number];

export default function SPA__PaginaModeradorCapacidadesInatas__Listagem() {
    const { listagemCapacidadesInatas, iniciaCadastro } = useContexto__PaginaModeradorCapacidadesInatas__Listagem();

    return (
        <ListagemComposta
            listagem={listagemCapacidadesInatas}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={capacidadeInata => capacidadeInata.id}
            renderizarItem={capacidadeInata => <RenderizaRegistroCapacidadeInata capacidadeInata={capacidadeInata} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Nova capacidade inata' }}
        />
    );
};

function RenderizaRegistroCapacidadeInata({ capacidadeInata }: { capacidadeInata: RegistroCapacidadeInata; }) {
    return (
        <article className={styles.card_capacidade_inata}>
            <strong>{capacidadeInata.nome}</strong>
        </article>
    );
};
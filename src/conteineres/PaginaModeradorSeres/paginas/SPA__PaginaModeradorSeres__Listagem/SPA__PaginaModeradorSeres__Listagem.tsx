import styles from './styles.module.css';

import { pluralize } from 'types-nora-api';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorSeres__Listagem } from 'Contextos/Contexto__PaginaModeradorSeres__Listagem/contexto';

type RegistroSer = ReturnType<typeof useContexto__PaginaModeradorSeres__Listagem>['listagemSeres']['registros'][number];

export default function SPA__PaginaModeradorSeres__Listagem() {
    const { listagemSeres, iniciaCadastro } = useContexto__PaginaModeradorSeres__Listagem();

    return (
        <ListagemComposta
            listagem={listagemSeres}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            obterIdRegistro={ser => ser.id}
            renderizarItem={ser => <RenderizaRegistroSer ser={ser} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo ser' }}
        />
    );
};

function RenderizaRegistroSer({ ser }: { ser: RegistroSer; }) {
    const totalCapacidades = ser.membros.reduce((total, membro) => total + membro.capacidades.length, 0);

    return (
        <article className={styles.card_ser}>
            <strong>{ser.nome}</strong>
            <span>{ser.membros.length} {pluralize(ser.membros.length, 'membro')}</span>
            <span>{totalCapacidades} {pluralize(totalCapacidades, 'capacidade inata associada', 'capacidades inatas associadas')}</span>
        </article>
    );
};
import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerSeres__Listagem } from 'Contextos/Contexto__PaginaGameDesignerSeres__Listagem/contexto';

type RegistroSer = ReturnType<typeof useContexto__PaginaGameDesignerSeres__Listagem>['listagemSeres']['registros'][number];

export default function SPA__PaginaGameDesignerSeres__Listagem() {
    const { listagemSeres, iniciaCadastro } = useContexto__PaginaGameDesignerSeres__Listagem();

    return (
        <ListagemComposta
            listagem={listagemSeres}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={ser => ser.fkSerId}
            renderizarItem={ser => <RenderizaRegistroSer ser={ser} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Ser' }}
        />
    );
};

function RenderizaRegistroSer({ ser }: { ser: RegistroSer; }) {
    const { selecionaSer } = useContexto__PaginaGameDesignerSeres__Listagem();

    return (
        <button type="button" className={styles.card_ser} onClick={() => selecionaSer(ser.fkSerId)}>
            <strong className={styles.card_ser_nome}>{ser.nome}</strong>
            <span className={styles.card_ser_gep}>{ser.gep ?? '—'}</span>
        </button>
    );
};

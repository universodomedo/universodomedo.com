import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerNovoSer__Listagem } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Listagem/contexto';

type RegistroSer = ReturnType<typeof useContexto__PaginaGameDesignerNovoSer__Listagem>['listagemSeres']['registros'][number];

export default function SPA__PaginaGameDesignerNovoSer__Listagem() {
    const { listagemSeres, iniciaCadastro } = useContexto__PaginaGameDesignerNovoSer__Listagem();

    return (
        <ListagemComposta
            listagem={listagemSeres}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={ser => ser.id}
            renderizarItem={ser => <RenderizaRegistroSer ser={ser} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Ser' }}
        />
    );
};

function RenderizaRegistroSer({ ser }: { ser: RegistroSer; }) {
    return (
        <div className={styles.card_ser}>
            <strong className={styles.card_ser_id}>Ser #{ser.id}</strong>
            <span className={styles.card_ser_data}>{new Date(ser.dataCriacao).toLocaleString('pt-BR')}</span>
        </div>
    );
};

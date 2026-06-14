import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerSeres__Listagem } from 'Contextos/Contexto__PaginaGameDesignerSeres__Listagem/contexto';

type RegistroSer = ReturnType<typeof useContexto__PaginaGameDesignerSeres__Listagem>['listagemSeres']['registros'][number];

export default function SPA__PaginaGameDesignerSeres__Listagem() {
    const { listagemSeres, iniciaCadastro } = useContexto__PaginaGameDesignerSeres__Listagem();

    return (
        <ListagemComposta
            listagem={listagemSeres}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={ser => ser.id}
            renderizarItem={ser => <RenderizaRegistroSer ser={ser} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Ser' }}
        />
    );
};

function RenderizaRegistroSer({ ser }: { ser: RegistroSer; }) {
    const { selecionaSer } = useContexto__PaginaGameDesignerSeres__Listagem();
    const dataCriacao = new Date(ser.dataCriacao).toLocaleDateString('pt-BR');

    return (
        <button type="button" className={styles.registro_ser} onClick={() => selecionaSer(ser.id)}>
            <strong>Ser #{ser.id}</strong>
            <span>{ser.tipoSer.nome}</span>
            <span>{dataCriacao}</span>
        </button>
    );
};

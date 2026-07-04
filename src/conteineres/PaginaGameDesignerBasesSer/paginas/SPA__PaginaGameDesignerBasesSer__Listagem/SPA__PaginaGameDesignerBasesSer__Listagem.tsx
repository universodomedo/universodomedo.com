import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerBasesSer__Listagem } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__Listagem/contexto';

type RegistroBase = ReturnType<typeof useContexto__PaginaGameDesignerBasesSer__Listagem>['listagemBases']['registros'][number];

export default function SPA__PaginaGameDesignerBasesSer__Listagem() {
    const { listagemBases, iniciaCadastro } = useContexto__PaginaGameDesignerBasesSer__Listagem();

    return (
        <ListagemComposta
            listagem={listagemBases}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={base => base.id}
            renderizarItem={base => <RenderizaRegistroBase base={base} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Nova Base de Ser' }}
        />
    );
};

function RenderizaRegistroBase({ base }: { base: RegistroBase; }) {
    const { selecionaBase } = useContexto__PaginaGameDesignerBasesSer__Listagem();

    return (
        <button type="button" className={styles.card_base} onClick={() => selecionaBase(base.id)}>
            <strong className={styles.card_base_nome}>{base.nome}</strong>
        </button>
    );
};

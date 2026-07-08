import styles from './styles.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerNovoSer__Listagem } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Listagem/contexto';

type RegistroSer = ReturnType<typeof useContexto__PaginaGameDesignerNovoSer__Listagem>['listagemSeres']['registros'][number];

export default function SPA__PaginaGameDesignerNovoSer__Listagem() {
    const { listagemSeres, iniciaCadastro, abreEstrutura } = useContexto__PaginaGameDesignerNovoSer__Listagem();

    return (
        <ListagemComposta
            listagem={listagemSeres}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={ser => ser.id}
            renderizarItem={ser => <RenderizaRegistroSer ser={ser} aoAbrir={() => abreEstrutura(ser.id)} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Ser' }}
        />
    );
};

// Card clicável: abre a estrutura própria do Ser (jogável não-humano); humano/não-jogável cai na mensagem orientativa da vista de estrutura.
function RenderizaRegistroSer({ ser, aoAbrir }: { ser: RegistroSer; aoAbrir: () => void; }) {
    return (
        <DivClicavel className={styles.card_ser} onClick={aoAbrir}>
            <strong className={styles.card_ser_id}>Ser #{ser.id}</strong>
            <span className={styles.card_ser_data}>{new Date(ser.dataCriacao).toLocaleString('pt-BR')}</span>
        </DivClicavel>
    );
};

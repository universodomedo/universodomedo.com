import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem/contexto';

type RegistroCoeficiente = ReturnType<typeof useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem>['listagemCoeficientes']['registros'][number];

export default function SPA__PaginaGameDesignerCoeficientesGanhoEstatistica() {
    const { listagemCoeficientes, iniciaCadastro } = useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem();

    return (
        <ListagemComposta
            listagem={listagemCoeficientes}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={coeficiente => coeficiente.id}
            renderizarItem={coeficiente => <RenderizaCoeficiente coeficiente={coeficiente} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Novo Coeficiente' }}
        />
    );
};

function RenderizaCoeficiente({ coeficiente }: { coeficiente: RegistroCoeficiente; }) {
    const { selecionaCoeficiente } = useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem();

    return (
        <button type="button" className={styles.registro_coeficiente} onClick={() => selecionaCoeficiente(coeficiente.id)}>
            <strong>{coeficiente.classe.nome}</strong>
            <span>{coeficiente.estatisticaDanificavel.nome}</span>
            <span className={styles.valor}>{coeficiente.coeficiente}</span>
        </button>
    );
};

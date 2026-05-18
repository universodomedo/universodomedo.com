import { useContexto__PaginaModeradorEmblemas__SemAventuraSelecionada } from "Contextos/Contexto__PaginaModeradorEmblemas__SemEmblemaSelecionado/contexto";
import ListagemComposta, { ListagemCompostaModoExibicao } from "Componentes/Listagens/ListagemComposta/ListagemComposta";

export default function SPA__PaginaModeradorEmblemas__SemEmblemaSelecionado() {
    const { listagemEmblemas, estaEmProcessoCriacao, setEstaEmProcessoCriacao } = useContexto__PaginaModeradorEmblemas__SemAventuraSelecionada();

    return (
        <ListagemComposta
            listagem={listagemEmblemas}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={emblema => emblema.id}
            renderizarItem={emblema => <RenderizaRegistroEmblema key={emblema.id} emblema={emblema} />}
            novoRegistro={{ estaEmProcessoCriacao, aoIniciarCriacao: () => setEstaEmProcessoCriacao(true), textoBotao: 'Novo' }}
        />
    );
};

function RenderizaRegistroEmblema({ emblema }: { emblema: ReturnType<typeof useContexto__PaginaModeradorEmblemas__SemAventuraSelecionada>['listagemEmblemas']['registros'][number] }) {
    return (
        <></>
    );
};
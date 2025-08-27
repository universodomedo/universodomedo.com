import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import { FormatoMomento } from 'types-nora-api';

export function InformacoesGeraisSessao() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <SecaoDeConteudo>
            <h2>{sessaoSelecionada.detalheSessaoCanonica.episodioPorExtenso}</h2>

            {sessaoSelecionada.duracaoEmSegundos && (<h4>Duração: {formataDuracao(sessaoSelecionada.duracaoEmSegundos, FormatoMomento.HMS)}</h4>)}
        </SecaoDeConteudo>
    );
};

export function ListaAlertasSessao() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <SecaoDeConteudo>
            <></>
        </SecaoDeConteudo>
    );
};
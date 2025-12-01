import { EstiloSessao, SessaoDto } from "types-nora-api";

import SessaoEmVisualizacao from "Componentes/ElementosVisuais/SessaoEmVisualizacao/page";

export function VisualizacaoSessao({ sessaoSelecionada }: { sessaoSelecionada: SessaoDto }) {
    return (
        <>
            <h1>Sessão {sessaoSelecionada.id} - {sessaoSelecionada.estiloSessao}</h1>

            {sessaoSelecionada.estiloSessao && sessaoSelecionada.estiloSessao !== EstiloSessao.ERRO && <SessaoEmVisualizacao sessao={sessaoSelecionada} />}
        </>
    );
};
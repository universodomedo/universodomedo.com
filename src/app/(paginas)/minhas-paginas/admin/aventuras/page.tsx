'use client';

import { useRequisicao } from "Hooks/useRequisicao";
import { obtemTodosGruposParaAdmin } from "Uteis/ApiConsumer/ConsumerMiddleware";
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from "../componentes";
import { AdministrarAventuras_ConteudoGeral } from "./componentes";

export default function AdministrarAventuras() {
    const { dados: gruposAventuras, carregando, erro } = useRequisicao(obtemTodosGruposParaAdmin);

    if (carregando) return <p>Carregando...</p>;
    if (erro) return <p>Erro: {erro.message}</p>;
    if (!gruposAventuras) return <></>;

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <AdministrarAventuras_ConteudoGeral gruposAventuras={gruposAventuras} />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};
'use client';

import { useRequisicao } from "Hooks/useRequisicao";
import { obtemTodosGruposParaAdmin } from "Uteis/ApiConsumer/ConsumerMiddleware";
import { AdministrarAventuras_ConteudoGeral } from "./componentes";

export default function AdministrarAventuras() {
    const { dados: gruposAventuras, carregando, erro } = useRequisicao(obtemTodosGruposParaAdmin);

    if (carregando) return <p>Carregando...</p>;
    if (erro) return <p>Erro: {erro.message}</p>;
    if (!gruposAventuras) return <></>;

    return (
        <AdministrarAventuras_ConteudoGeral gruposAventuras={gruposAventuras} />
    );
};
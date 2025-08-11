'use client';

import { obtemTodasAventuras } from "Uteis/ApiConsumer/ConsumerMiddleware";
import { useRequisicao } from "Hooks/useRequisicao";
import { ListaAcoesAdmin } from "../componentes";
import { AdministrarAventuras_ConteudoGeral } from "./componentes";
import { LayoutVisualizacaoPadrao_ConteudoGeral, LayoutVisualizacaoPadrao_ConteudoMenu } from "Contextos/ContextoLayoutVisualizacaoPadrao/hooks";

export default function AdministrarAventuras() {
    const { dados: aventuras, carregando, erro } = useRequisicao(obtemTodasAventuras);

    if (carregando) return <p>Carregando...</p>;
    if (erro) return <p>Erro: {erro.message}</p>;
    if (!aventuras) return <></>;

    return (
        <>
            <LayoutVisualizacaoPadrao_ConteudoGeral proporcaoFlex={0.85}>
                <AdministrarAventuras_ConteudoGeral aventuras={aventuras} />
            </LayoutVisualizacaoPadrao_ConteudoGeral>

            <LayoutVisualizacaoPadrao_ConteudoMenu>
                <ListaAcoesAdmin />
            </LayoutVisualizacaoPadrao_ConteudoMenu>
        </>
    );
};
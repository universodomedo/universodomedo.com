'use client';

import { MENUS_INTERNOS } from "types-nora-api";

import { useRequisicao } from "Hooks/useRequisicao";
import { obtemTodosGruposParaAdmin } from "Uteis/ApiConsumer/ConsumerMiddleware";
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { AdministrarAventuras_ConteudoGeral } from "./componentes";
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';

export default function AdministrarAventuras() {
    const { dados: gruposAventuras, carregando, erro } = useRequisicao(obtemTodosGruposParaAdmin);

    if (carregando) return <p>Carregando...</p>;
    if (erro) return <p>Erro: {erro.message}</p>;
    if (!gruposAventuras) return <></>;

    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo>
                <AdministrarAventuras_ConteudoGeral gruposAventuras={gruposAventuras} />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.admin} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};
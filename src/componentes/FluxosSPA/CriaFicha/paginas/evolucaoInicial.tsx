'use client';

import { RecipienteEdicaoFicha } from "Contextos/ContextoEdicaoFicha/contexto";
import { useContextoPaginaJogadorCriaFicha } from "Contextos/ContextoPaginaJogadorCriaFicha/contexto";

export default function SPA_PaginaJogadorCriarFicha_EvolucaoInicial() {
    const { nomeFicha, descricaoFicha, metodoSalvarFicha, metodoSair, metodoAposSalvar } = useContextoPaginaJogadorCriaFicha();

    return (
        <RecipienteEdicaoFicha recipienteEdicaoFichaProps={{
            metodo: "CRIANDO_FICHA_TEMPORARIA",
            nomeFicha: nomeFicha,
            descricaoFicha: descricaoFicha,
            metodoSairEvolucaoFicha: metodoSair,
            metodoSalvarFicha: metodoSalvarFicha,
            metodoAposSalvar: metodoAposSalvar,
        }} />
    );
};
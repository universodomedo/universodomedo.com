'use client';

import { DadosEvolucaoFicha } from "types-nora-api";

import { RecipienteEdicaoFicha } from "Contextos/ContextoEdicaoFicha/contexto";
import { useContextoPaginaJogadorCriaFicha } from "Contextos/ContextoPaginaJogadorCriaFicha/contexto";
import { me_criaEVinculaFicha__FichaTemporaria } from "Uteis/ApiConsumer/ConsumerMiddleware";

export default function SPA_PaginaJogadorCriarFicha_EvolucaoInicial() {
    const { navegarPara, nomeFicha, descricaoFicha } = useContextoPaginaJogadorCriaFicha();

    return (
        <RecipienteEdicaoFicha recipienteEdicaoFichaProps={{
            metodo: "CRIANDO_FICHA_TEMPORARIA",
            nomeFicha: nomeFicha,
            descricaoFicha: descricaoFicha,
            metodoSairEvolucaoFicha: () => navegarPara("INICIAL"),
            metodoSalvarFicha: (dadosEvolucaoFicha: DadosEvolucaoFicha): Promise<number> => {
                return me_criaEVinculaFicha__FichaTemporaria(nomeFicha, descricaoFicha, dadosEvolucaoFicha);
            },
        }} />
    );
};
'use client';

import { EtapaGanhoEvolucao_ValorMaxAtributo, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function InformativoAumentoMaximoAtributo() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAumentoMaximoAtributo = ganhos.etapaAtual as EtapaGanhoEvolucao_ValorMaxAtributo;

    return (
        <p>Valor Máximo de Atributo foi aumentado de {etapaAumentoMaximoAtributo.valorMaximoAnterior} para {etapaAumentoMaximoAtributo.valorMaximoNovo}</p>
    );
};
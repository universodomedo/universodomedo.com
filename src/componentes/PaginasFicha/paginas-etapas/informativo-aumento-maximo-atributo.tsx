'use client';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EtapaGanhoEvolucao_ValorMaxAtributo } from 'Contextos/ContextoEdicaoFicha/classes';

export default function InformativoAumentoMaximoAtributo() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAumentoMaximoAtributo = ganhos.etapaAtual as EtapaGanhoEvolucao_ValorMaxAtributo;

    return (
        <p>Valor Máximo de Atributo foi aumentado de {etapaAumentoMaximoAtributo.valorMaximoAnterior} para {etapaAumentoMaximoAtributo.valorMaximoNovo}</p>
    );
};
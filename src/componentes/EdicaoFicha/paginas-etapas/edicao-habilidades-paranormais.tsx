'use client';

import { EtapaGanhoEvolucao_HabilidadesParanormais, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function EdicaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeParanormal = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesParanormais;

    return (
        <p>Pontos de Habilidade Paranormal aumentados de {etapaInformativoHabilidadeParanormal.quantidadeDePontosAtual} para {etapaInformativoHabilidadeParanormal.quantidadeDePontosNova}</p>
    );
};
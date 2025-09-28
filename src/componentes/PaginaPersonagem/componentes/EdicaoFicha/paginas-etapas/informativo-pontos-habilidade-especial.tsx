'use client';

import { EtapaGanhoEvolucao_HabilidadesEspeciais, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function InformativoPontosHabilidadeEspecial() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeEspecial = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesEspeciais;

    return (
        <p>Pontos de Habilidade Especial aumentados de {etapaInformativoHabilidadeEspecial.quantidadeDePontosAtual} para {etapaInformativoHabilidadeEspecial.quantidadeDePontosNova}</p>
    );
};
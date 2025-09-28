'use client';

import { EtapaGanhoEvolucao_HabilidadesElementais, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function EdicaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeElemental = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesElementais;

    return (
        <p>Limite na quantidade de Habilidade Elemental aumentados de {etapaInformativoHabilidadeElemental.quantidadeDePontosAtual} para {etapaInformativoHabilidadeElemental.quantidadeDePontosNova}</p>
    );
};
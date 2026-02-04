'use client';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EtapaGanhoEvolucao_HabilidadesElementais } from 'Contextos/ContextoEdicaoFicha/classes';

export default function EdicaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeElemental = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesElementais;

    return (
        <p>Limite na quantidade de Habilidade Elemental aumentados de {etapaInformativoHabilidadeElemental.quantidadeDePontosAtual} para {etapaInformativoHabilidadeElemental.quantidadeDePontosNova}</p>
    );
};
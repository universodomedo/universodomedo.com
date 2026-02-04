'use client';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EtapaGanhoEvolucao_HabilidadesParanormais } from 'Contextos/ContextoEdicaoFicha/classes';

export default function EdicaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeParanormal = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesParanormais;

    return (
        <p>Pontos de Habilidade Paranormal aumentados de {etapaInformativoHabilidadeParanormal.quantidadeDePontosAtual} para {etapaInformativoHabilidadeParanormal.quantidadeDePontosNova}</p>
    );
};
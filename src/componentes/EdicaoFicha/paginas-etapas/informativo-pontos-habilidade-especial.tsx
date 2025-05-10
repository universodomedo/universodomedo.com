'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_HabilidadesEspeciais, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function InformativoPontosHabilidadeEspecial() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaInformativoHabilidadeEspecial = ganhos.etapaAtual as EtapaGanhoEvolucao_HabilidadesEspeciais;

    return (
        <h3>Pontos de Habilidade Especial aumentados de {etapaInformativoHabilidadeEspecial.quantidadeDePontosAtual} para {etapaInformativoHabilidadeEspecial.quantidadeDePontosNova}</h3>
    );
};
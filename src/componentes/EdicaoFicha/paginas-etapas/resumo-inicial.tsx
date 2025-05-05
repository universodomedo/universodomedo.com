'use client';

import { pluralize } from 'Uteis/UteisTexto/pluralize';
import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoInicial() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            {ganhos.ganhos.some(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos) && <SecaoAtributos />}
            {ganhos.ganhos.some(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) && <SecaoPericias />}
        </>
    );
};

function SecaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapaAtual as EtapaGanhoEvolucao_Atributos;

    return (
        <>
            <h2>{etapaAtributos.tituloEtapa}</h2>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Atributos podem variar de {etapaAtributos.valorMinAtributo} até {etapaAtributos.valorMaxAtributo}</p>
                {etapaAtributos.obtemNumeroPontosGanho > 0 && (
                    <p>{etapaAtributos.obtemNumeroPontosGanho} {pluralize(etapaAtributos.obtemNumeroPontosGanho, 'Ponto')} para distribuir entre seus Atributos</p>
                )}
                {etapaAtributos.obtemNumeroPontosTroca > 0 && (
                    <p>{etapaAtributos.obtemNumeroPontosTroca} {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Ponto')} {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Opcional', 'Opcionais')} para trocar entre seus Atributos</p>
                )}
            </div>
        </>
    );
};

function SecaoPericias() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaPericias = ganhos.etapaAtual as EtapaGanhoEvolucao_Pericias;

    return (
        <>
            <h2></h2>
        </>
    );
};
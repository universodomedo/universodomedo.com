'use client';

import { pluralize } from 'Uteis/UteisTexto/pluralize';
import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoInicial() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos) && <SecaoAtributos />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) && <SecaoPericias />}
        </>
    );
};

function SecaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos)!;

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

    const etapaPericias = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias)!;

    return (
        <>
            <h2>{etapaPericias.tituloEtapa}</h2>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                {GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const numeroPontosParaPatente = etapaPericias.obtemNumeroPontosGanhoPorPatente(patente);
                    if (numeroPontosParaPatente === 0) return;
                    
                    const patenteAnteriorAoPonto = GanhosEvolucao.dadosReferencia.patentes.find(patenteAnterior => patenteAnterior.id === (patente.id - 1));

                    return (
                        <div key={patente.id} className={styles.recipiente_patente_pericia}>
                            <h3>Perícias {pluralize(2, patente.nome)}</h3>
                            <p>{numeroPontosParaPatente} {pluralize(numeroPontosParaPatente, 'Ponto')} para melhorar Perícias {pluralize(2, patenteAnteriorAoPonto!.nome)} para {patente.nome}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
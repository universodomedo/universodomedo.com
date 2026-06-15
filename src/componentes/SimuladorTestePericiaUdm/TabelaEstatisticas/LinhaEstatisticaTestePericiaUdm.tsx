import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { PatentePericiaCompletaDto, ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import { criaResumoAnaliticoTestePericiaUdm, descreveCenarioTestePericiaUdm, formataMedianaTestePericiaUdm, formataModasTestePericiaUdm, formataNumeroDistribuicaoTeste, formataPercentualDistribuicaoTeste } from 'Funcionalidades/simuladorTestePericiaUdm/formatacaoSimuladorTestePericiaUdm';
import type { CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import styles from './tabela.module.css';

export default function LinhaEstatisticaTestePericiaUdm({ cenario, patente, resultado }: { cenario: CenarioSimuladorTestePericiaUdm; patente: PatentePericiaCompletaDto | null; resultado: ResultadoAnaliseCenarioTestePericia; }) {
    const resumoAnalitico = criaResumoAnaliticoTestePericiaUdm(cenario, patente, resultado);
    const faixa = resultado.faixa;
    return (
        <TooltipPrimitive.Root delayDuration={350}>
            <TooltipPrimitive.Trigger asChild>
                <tr className={styles.linhaComResumo} tabIndex={0}>
                    <td><span className={styles.identificadorCor} style={{ background: cenario.cor }} /><strong>{cenario.nome}</strong><small>{descreveCenarioTestePericiaUdm(cenario, patente)}</small></td>
                    <td>{faixa.valorAtributoFinal}<small>{faixa.valorAtributoBase} base {formataSinal(faixa.incrementoModificadoresAtributo)} mod.</small></td>
                    <td>{patente?.nome ?? faixa.idPatentePericia}</td>
                    <td>{faixa.valorMinimo}<small>{descreveCalculoMinimo(faixa)}</small></td>
                    <td>{faixa.valorMaximo}<small>{descreveCalculoMaximo(faixa)}</small></td>
                    <td>{formataNumeroDistribuicaoTeste(resultado.estatisticas.media)}</td>
                    <td>{formataMedianaTestePericiaUdm(resultado.estatisticas.mediana)}</td>
                    <td>{formataModasTestePericiaUdm(resultado)}</td>
                    <td>{formataNumeroDistribuicaoTeste(resultado.estatisticas.desvioPadrao)}</td>
                    {resultado.estatisticas.probabilidadesResultadosAlvo.map(item => <td key={item.resultadoAlvo}>{formataPercentualDistribuicaoTeste(item.probabilidade)}</td>)}
                </tr>
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content className={styles.resumoAnalitico} side="top" align="center" sideOffset={8}>
                    <strong>Resumo teórico</strong>
                    <p>{resumoAnalitico}</p>
                    <TooltipPrimitive.Arrow className={styles.setaResumoAnalitico} />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
};

function formataSinal(valor: number): string { return valor >= 0 ? `+ ${valor}` : `- ${Math.abs(valor)}`; };

function descreveCalculoMinimo(faixa: ResultadoAnaliseCenarioTestePericia['faixa']): string {
    if (faixa.valorMinimo !== faixa.valorMinimoParametrizado) return `Parametrizado ${faixa.valorMinimoParametrizado}; normalizado para ${faixa.valorMinimo}`;
    return `Atributo ${faixa.valorMinimoPorAtributo} ${formataSinal(faixa.incrementoPatenteValorMinimoAcumulado)} patente`;
};

function descreveCalculoMaximo(faixa: ResultadoAnaliseCenarioTestePericia['faixa']): string {
    if (faixa.valorMaximo !== faixa.valorMaximoParametrizado) return `Parametrizado ${faixa.valorMaximoParametrizado}; normalizado para ${faixa.valorMaximo}`;
    return `Base ${faixa.valorMaximoBase} ${formataSinal(faixa.incrementoPatenteValorMaximoAcumulado)} patente ${formataSinal(faixa.incrementoModificadoresValorMaximo)} mod.`;
};
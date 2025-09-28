'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Atributos, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { AtributoFicha } from 'types-nora-api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TooltipEvolucao_Atributo } from './componentes-edicao/tooltips-edicao';
import { CorpoEstatistica } from './componentes-edicao/exibicao-estatistica';

export default function EdicaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <div className={styles.editando_ficha_atributos}>
            <div className={styles.atributos}>
                {ganhos.fichaDeJogoEvoluida.atributos.sort((a, b) => a.atributo.id - b.atributo.id).map(atributoFicha => (
                    <CorpoAtributo key={atributoFicha.atributo.id} atributoFicha={atributoFicha} />
                ))}

                <div className={styles.editando_ficha_estatisticas}>
                    {ganhos.fichaDeJogoEvoluida.estatisticasDanificaveis.map(estatisticaDanificavelFicha => (
                        <CorpoEstatistica key={estatisticaDanificavelFicha.estatisticaDanificavel.id} estatisticaDanificavel={estatisticaDanificavelFicha.estatisticaDanificavel} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function CorpoAtributo({ atributoFicha }: { atributoFicha: AtributoFicha }) {
    const { ganhos, executaEAtualiza } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapaAtual as EtapaGanhoEvolucao_Atributos;

    return (
        <div className={styles.corpo_atributo}>
            <TooltipEvolucao_Atributo atributo={atributoFicha.atributo} infoGanhoEstatistica={true} >
                <h2 className={styles.nome_atributo}>{atributoFicha.atributo.nome}</h2>
            </TooltipEvolucao_Atributo>
            <div className={styles.valor_atributo}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.subtraiPonto(atributoFicha.atributo) }) }} disabled={!etapaAtributos.botaoRemoverEstaHabilitado(atributoFicha)}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <h2>{atributoFicha.valor}</h2>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.adicionaPonto(atributoFicha.atributo) }) }} disabled={!etapaAtributos.botaoAdicionarEstaHabilitado(atributoFicha)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        </div>
    );
};
'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoFinal() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos) && <SecaoAtributos />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) && <SecaoPericias />}
            {/* <SecaoEstatisticas /> */}
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
                {ganhos.atributosEditados.map(atributoEditado => {
                    const atributoAntesDaEdicao = ganhos.refPersonagem.fichaVigente?.atributos.find(atributoAntesDaEdicao => atributoAntesDaEdicao.atributo.id === atributoEditado.atributo.id)!;

                    if (atributoAntesDaEdicao.valor === atributoEditado.valor) return;

                    const operacao = atributoEditado.valor > atributoAntesDaEdicao.valor ? 'aumentou' : 'diminui';

                    return (
                        <p key={atributoEditado.atributo.id}>{atributoEditado.atributo.nome} {operacao} de {atributoAntesDaEdicao.valor} para {atributoEditado.valor}</p>
                    );
                })}
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
                {ganhos.periciasAgrupadasEEditadas.map(atributo => atributo.periciasDesseAtributo.map(periciaEditada => {
                    const periciaAntesDaEdicao = ganhos.refPersonagem.fichaVigente?.pericias.find(periciaAntesDaEdicao => periciaAntesDaEdicao.pericia.id === periciaAntesDaEdicao.pericia.id)!;

                    if (periciaAntesDaEdicao.patentePericia.id === periciaEditada.patenteAtualDaPericia.id) return;

                    const operacao = periciaEditada.patenteAtualDaPericia.id > periciaAntesDaEdicao.patentePericia.id ? 'melhorada' : 'regredida';

                    return (
                        <p key={periciaEditada.pericia.id}>{periciaEditada.pericia.nome} foi {operacao} de {periciaAntesDaEdicao.patentePericia.nome} para {periciaEditada.patenteAtualDaPericia.nome}</p>
                    );
                }))}
            </div>
        </>
    );
};

// function SecaoEstatisticas() {
//     const { ganhos } = useContextoEdicaoFicha();

//     return (
//         <>
//             <h2>Estatísticas</h2>

//             <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
//                 {Object.values(ganhos.estatisticasDanificaveisEmEdicao).map(estatisticaEditada => (
//                     <p>{estatisticaEditada.{estatisticaEditada.valorAtual} </p>
//                 ))}
//             </div>
//         </>
//     );
// }
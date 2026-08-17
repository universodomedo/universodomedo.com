import styles from './styles.module.css';

import { ESTADO_INICIAL_ROTEIRO_EDITOR3D, executaPassosRoteiroEditor3D, rotuloOperacaoRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.operacoes';
import { useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao/contexto';
import type { ResultadoValidacaoRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.roteiro';

type SituacaoPassoDetalhe = 'CONFERE' | 'ACUSADO' | 'NAO_COMPARADO' | 'SEM_COMPARACAO';

// Sem golden não há o que conferir: o passo é só leitura (o "como se faz"), sem ✓ nem ✗ que sugiram julgamento.
function situacaoDoPasso(indice: number, resultado: ResultadoValidacaoRoteiroEditor3D | null): SituacaoPassoDetalhe {
    if (resultado === null) return 'SEM_COMPARACAO';
    if (resultado.desfecho === 'VALIDO') return 'CONFERE';
    if (indice < resultado.indicePasso) return 'CONFERE';
    if (indice === resultado.indicePasso) return 'ACUSADO';
    return 'NAO_COMPARADO';
};

function seloDesfecho(resultado: ResultadoValidacaoRoteiroEditor3D): { rotulo: string; classe: string } {
    if (resultado.desfecho === 'VALIDO') return { rotulo: '✓ válido', classe: styles.selo_valido };
    if (resultado.desfecho === 'DIVERGENTE') return { rotulo: `divergente · passo ${resultado.indicePasso + 1}`, classe: styles.selo_divergente };
    return { rotulo: `falhou · passo ${resultado.indicePasso + 1}`, classe: styles.selo_falhou };
};

export default function SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao() {
    const { detalhe } = useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao();
    const { roteiro, resultado } = detalhe;

    // Rótulos derivados da MESMA reexecução que a validação fez (estado anterior a cada passo).
    const execucao = executaPassosRoteiroEditor3D(roteiro.passos);
    const selo = resultado === null ? null : seloDesfecho(resultado);

    return (
        <div className={styles.recipiente}>
            <p className={styles.objetivo}>{roteiro.objetivo}</p>
            {roteiro.bloqueadoMotivo !== null && <p className={styles.motivo_bloqueio}>{roteiro.bloqueadoMotivo}</p>}
            <div className={styles.cabeca_resultado}>
                {selo !== null
                    ? <span className={`${styles.selo} ${selo.classe}`}>{selo.rotulo}</span>
                    : <span className={`${styles.selo} ${styles.selo_montagem}`}>em montagem · sem resultado aprovado</span>}
            </div>

            {roteiro.passos.length === 0 && <p className={styles.sem_passos}>Este roteiro ainda não tem passos. Eles são preenchidos no Painel de Roteiros, dentro do Editor 3D.</p>}

            <div className={styles.lista_passos}>
                {roteiro.passos.map((passo, indice) => {
                    const situacao = situacaoDoPasso(indice, resultado);
                    const rotulo = rotuloOperacaoRoteiroEditor3D(passo.operacao, indice === 0 ? ESTADO_INICIAL_ROTEIRO_EDITOR3D : (execucao.estados[indice - 1] ?? ESTADO_INICIAL_ROTEIRO_EDITOR3D));
                    return (
                        <div key={indice} className={`${styles.passo} ${situacao === 'ACUSADO' ? styles.acusado : ''} ${situacao === 'NAO_COMPARADO' ? styles.nao_comparado : ''}`}>
                            <span className={styles.icone_passo}>{situacao === 'CONFERE' ? '✓' : situacao === 'ACUSADO' ? '✗' : situacao === 'NAO_COMPARADO' ? '—' : '·'}</span>
                            <div className={styles.corpo_passo}>
                                <span className={styles.rotulo_passo}>{indice + 1} · {rotulo}</span>
                                {situacao === 'ACUSADO' && resultado !== null && <span className={styles.motivo_passo}>{resultado.desfecho === 'FALHOU' ? resultado.motivo : 'Serializado divergiu do resultado aprovado.'}</span>}
                                {passo.comentario !== undefined && passo.comentario.length > 0 && <span className={styles.comentario_passo}>{passo.comentario}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
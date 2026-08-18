import styles from './styles.module.css';

import { ESTADO_INICIAL_ROTEIRO_EDITOR3D, executaPassosRoteiroEditor3D, rotuloOperacaoRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.operacoes';
import { useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao/contexto';
import type { DesfechoEtapaRoteiroEditor3D, EtapaValidadaRoteiroEditor3D, ResultadoValidacaoRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.roteiro';

// Apresentação da etapa. Sem golden não há o que conferir: o passo é só leitura (o "como se faz"), sem ✓ nem ✗ que
// sugiram julgamento. Com golden, cada etapa responde por si — o ícone distingue quem REGREDIU de quem foi arrastada.
const APRESENTACAO_ETAPA: Record<DesfechoEtapaRoteiroEditor3D, { icone: string; classe?: 'acusado' | 'nao_comparado' }> = {
    CONFERE: { icone: '✓' },
    REGREDIU: { icone: '✗', classe: 'acusado' },
    NAO_EXECUTOU: { icone: '✗', classe: 'acusado' },
    CONTAMINADA: { icone: '—', classe: 'nao_comparado' },
};

function seloDesfecho(resultado: ResultadoValidacaoRoteiroEditor3D): { rotulo: string; classe: string } {
    if (resultado.desfecho === 'VALIDO') return { rotulo: '✓ válido', classe: styles.selo_valido };
    if (resultado.desfecho === 'DIVERGENTE') return { rotulo: `divergente · passo ${resultado.indicePasso + 1}`, classe: styles.selo_divergente };
    return { rotulo: `falhou · passo ${resultado.indicePasso + 1}`, classe: styles.selo_falhou };
};

export default function SPA__PaginaColaboradorRoteirosEditor3D__DetalheValidacao() {
    const { detalhe } = useContexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao();
    const { roteiro, resultado, etapas } = detalhe;

    // Rótulos derivados da MESMA reexecução que a validação fez (estado anterior a cada passo).
    const execucao = executaPassosRoteiroEditor3D(roteiro.passos);
    const selo = resultado === null ? null : seloDesfecho(resultado);
    const etapaPorIndice = new Map<number, EtapaValidadaRoteiroEditor3D>(etapas.map(etapa => [etapa.indice, etapa]));
    const conferem = etapas.filter(etapa => etapa.desfecho === 'CONFERE').length;

    return (
        <div className={styles.recipiente}>
            <p className={styles.objetivo}>{roteiro.objetivo}</p>
            {roteiro.bloqueadoMotivo !== null && <p className={styles.motivo_bloqueio}>{roteiro.bloqueadoMotivo}</p>}
            <div className={styles.cabeca_resultado}>
                {selo !== null
                    ? <span className={`${styles.selo} ${selo.classe}`}>{selo.rotulo}</span>
                    : <span className={`${styles.selo} ${styles.selo_montagem}`}>em montagem · sem resultado aprovado</span>}
                {/* Placar por etapa: cada uma responde por si (entrada aprovada + operação atual ⇒ saída aprovada). */}
                {etapas.length > 0 && <span className={styles.placar_etapas}>{conferem} de {etapas.length} {etapas.length === 1 ? 'etapa confere' : 'etapas conferem'}</span>}
            </div>

            {roteiro.passos.length === 0 && <p className={styles.sem_passos}>Este roteiro ainda não tem passos. Eles são preenchidos no Painel de Roteiros, dentro do Editor 3D.</p>}

            <div className={styles.lista_passos}>
                {roteiro.passos.map((passo, indice) => {
                    const etapa = etapaPorIndice.get(indice) ?? null;
                    const apresentacao = etapa === null ? null : APRESENTACAO_ETAPA[etapa.desfecho];
                    const rotulo = rotuloOperacaoRoteiroEditor3D(passo.operacao, indice === 0 ? ESTADO_INICIAL_ROTEIRO_EDITOR3D : (execucao.estados[indice - 1] ?? ESTADO_INICIAL_ROTEIRO_EDITOR3D));
                    return (
                        <div key={indice} className={`${styles.passo} ${apresentacao?.classe === 'acusado' ? styles.acusado : ''} ${apresentacao?.classe === 'nao_comparado' ? styles.nao_comparado : ''}`}>
                            <span className={styles.icone_passo}>{apresentacao?.icone ?? '·'}</span>
                            <div className={styles.corpo_passo}>
                                <span className={styles.rotulo_passo}>{indice + 1} · {rotulo}</span>
                                {etapa?.motivo !== null && etapa?.motivo !== undefined && <span className={styles.motivo_passo}>{etapa.motivo}</span>}
                                {passo.comentario !== undefined && passo.comentario.length > 0 && <span className={styles.comentario_passo}>{passo.comentario}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
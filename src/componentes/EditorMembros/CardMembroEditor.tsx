'use client';

import styles from './styles.module.css';

import { type CSSProperties } from 'react';
import cn from 'classnames';

import { corDoTipoInteracao, COR_TIPO_PADRAO } from './tiposInteracaoVisual';
import type { CapacidadeInataMembroEditor, MembroEditor } from './membrosSerJogavelEditor';

type Props = {
    membro: MembroEditor;
    capacidades: readonly CapacidadeInataMembroEditor[];
    ativo: boolean;
    aoSelecionar: () => void;
};

// Card de resumo de um membro na coluna de listagem do EditorMembros (componente final por props): filete/gemas na cor do tipo de interação + resumo das ações.
export function CardMembroEditor({ membro, capacidades, ativo, aoSelecionar }: Props) {
    const capacidadesDoMembro = capacidades.filter(capacidade => membro.idsCapacidadesInatas.includes(capacidade.id));
    const tipos = [...new Set(capacidadesDoMembro.map(capacidade => capacidade.nomeInteracao).filter((tipo): tipo is string => typeof tipo === 'string'))];
    const corMembro = tipos.length === 1 ? corDoTipoInteracao(tipos[0]) : COR_TIPO_PADRAO;

    return (
        <button type="button" className={cn(styles.card_membro, { [styles.ativo]: ativo })} onClick={aoSelecionar} style={{ '--cor-membro': corMembro } as CSSProperties}>
            <span className={styles.linha_nome}>
                <span className={styles.nome_membro}>{membro.nome.trim() || '—'}</span>
                <span className={styles.gemas}>{tipos.map(tipo => <span key={tipo} className={styles.gema} style={{ '--cor-gema': corDoTipoInteracao(tipo) } as CSSProperties} title={tipo} />)}</span>
            </span>
            <span className={styles.capacidades_membro}>{capacidadesDoMembro.map(capacidade => capacidade.nome).join(' · ') || 'Sem Capacidades Inatas'}</span>
            {membro.acoes.length > 0
                ? <span className={styles.acoes_membro}>{membro.acoes.map(acao => <span key={acao.idLocal}>{acao.nome.trim() || '—'}{typeof acao.parametros.dano === 'number' && <b className={styles.dano_resumo}> {acao.parametros.dano}</b>}</span>)}</span>
                : <span className={styles.acoes_membro_vazio}>sem ações</span>}
        </button>
    );
};

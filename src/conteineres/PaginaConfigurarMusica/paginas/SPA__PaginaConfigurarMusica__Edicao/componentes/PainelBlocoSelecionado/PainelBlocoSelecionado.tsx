'use client';

import styles from './styles.module.css';

import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { BlocoMontagemMusica } from 'types-nora-api';

import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { formatarMs } from '../editorMusica.uteis';

type PainelBlocoSelecionadoProps = {
    bloco: BlocoMontagemMusica | null;
    podeRemover: boolean;
    onRenomear: (nome: string) => void;
    onTestar: () => void;
    onRemover: () => void;
};

export default function PainelBlocoSelecionado(props: PainelBlocoSelecionadoProps): JSX.Element {
    if (!props.bloco) return <div className={styles.painel}><span className={styles.vazio}>Selecione um bloco na timeline para editar.</span></div>;

    const bloco = props.bloco;
    const duracaoMs = bloco.fimMs - bloco.inicioMs;

    return (
        <div className={styles.painel}>
            <div className={styles.cabecalho}>
                <span className={styles.titulo}>Bloco</span>
                <div className={styles.acoes}>
                    <button className={styles.botaoTestar} onClick={props.onTestar} title="Tocar este bloco">
                        <FontAwesomeIcon icon={faPlay} /> Testar
                    </button>
                    <button className={styles.botaoRemover} disabled={!props.podeRemover} onClick={props.onRemover} title="Remover este bloco">
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>

            <InputComRotulo rotulo={'Nome do bloco'}>
                <input className={styles.campoNome} value={bloco.nome} onChange={evento => props.onRenomear(evento.target.value)} placeholder="Ex: Refrão" />
            </InputComRotulo>

            <div className={styles.tempos}>
                <span className={styles.tempo}><span className={styles.tempoRotulo}>Início</span>{formatarMs(bloco.inicioMs)}</span>
                <span className={styles.tempo}><span className={styles.tempoRotulo}>Fim</span>{formatarMs(bloco.fimMs)}</span>
                <span className={styles.tempo}><span className={styles.tempoRotulo}>Duração</span>{formatarMs(duracaoMs)}</span>
            </div>
        </div>
    );
};

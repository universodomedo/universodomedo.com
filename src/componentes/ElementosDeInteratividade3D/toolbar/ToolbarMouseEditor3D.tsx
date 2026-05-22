'use client';

import styles from './styles.module.css';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';

const ferramentasMouseEditor3D = [
    { key: 'SELECIONAR', rotulo: 'Selecionar', atalho: 'LMB' },
    { key: 'ROTACIONAR', rotulo: 'Rotacionar', atalho: 'MMB' },
    { key: 'PAN', rotulo: 'Pan', atalho: 'Shift + MMB' },
] as const;

interface BotaoFerramentaMouseEditor3DProps {
    ferramenta: typeof ferramentasMouseEditor3D[number];
    ferramentaAtiva: FerramentaMouseEditor3D;
    ativaFerramentaMouse: (ferramenta: FerramentaMouseEditor3D) => void;
};

function BotaoFerramentaMouseEditor3D({ ferramenta, ferramentaAtiva, ativaFerramentaMouse }: BotaoFerramentaMouseEditor3DProps) {
    const ativo = ferramentaAtiva === ferramenta.key;

    return (
        <button className={`${styles.botaoFerramentaMouseEditor3D} ${ativo ? styles.botaoFerramentaMouseEditor3DAtivo : ''}`} type="button" onClick={() => ativaFerramentaMouse(ferramenta.key)} aria-pressed={ativo} title={`${ferramenta.rotulo} (${ferramenta.atalho})`}>
            <span>{ferramenta.rotulo[0]}</span>
            <strong>{ferramenta.atalho}</strong>
        </button>
    );
};

export function ToolbarMouseEditor3D() {
    const { estado, acoes } = useEditor3DContexto();

    return (
        <aside className={styles.toolbarMouseEditor3D} data-editor3d-toolbar-mouse="true" aria-label="Ferramentas do mouse">
            {ferramentasMouseEditor3D.map(ferramenta => <BotaoFerramentaMouseEditor3D key={ferramenta.key} ferramenta={ferramenta} ferramentaAtiva={estado.ferramentaMouse} ativaFerramentaMouse={acoes.ativaFerramentaMouse} />)}
        </aside>
    );
};
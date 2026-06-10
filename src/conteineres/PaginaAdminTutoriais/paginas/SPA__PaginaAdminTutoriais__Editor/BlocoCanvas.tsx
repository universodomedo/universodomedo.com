import styles from './BlocoCanvas.module.css';

import MarkdownTutorial from 'Componentes/Elementos/MarkdownTutorial/MarkdownTutorial';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { AreaPercentual } from 'types-nora-api';
import type { BlocoLocalTutorial, DirecaoResizeTutorial } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/tutorialEditor.types';

const DIRECOES_RESIZE: readonly DirecaoResizeTutorial[] = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

type BlocoCanvasProps = {
    passoId: number;
    bloco: BlocoLocalTutorial;
    caminhoImagem: string | null;
    selecionado: boolean;
    aoSelecionar: () => void;
    iniciaDrag: (evento: ReactPointerEvent, idPasso: number, idBloco: number, area: AreaPercentual) => void;
    iniciaResize: (evento: ReactPointerEvent, idPasso: number, idBloco: number, area: AreaPercentual, direcao: DirecaoResizeTutorial) => void;
};

export default function BlocoCanvas({ passoId, bloco, caminhoImagem, selecionado, aoSelecionar, iniciaDrag, iniciaResize }: BlocoCanvasProps) {
    const estilo = { left: `${bloco.area.x}%`, top: `${bloco.area.y}%`, width: `${bloco.area.largura}%`, height: `${bloco.area.altura}%` };

    function aoApontar(evento: ReactPointerEvent): void { aoSelecionar(); iniciaDrag(evento, passoId, bloco.idLocal, bloco.area); };

    return (
        <div className={selecionado ? styles.bloco_selecionado : styles.bloco} style={estilo} onPointerDown={aoApontar}>
            {bloco.tipo === 'imagem' && caminhoImagem && <img className={styles.imagem} src={caminhoImagem} alt="" draggable={false} />}
            {bloco.tipo === 'imagem' && !caminhoImagem && <span className={styles.vazio}>Sem imagem</span>}
            {bloco.tipo === 'texto' && (bloco.markdown.trim() ? <MarkdownTutorial markdown={bloco.markdown} /> : <span className={styles.vazio}>Texto</span>)}
            {selecionado && DIRECOES_RESIZE.map(direcao => (
                <button key={direcao} type="button" aria-label={`Redimensionar (${direcao})`} className={`${styles.handle} ${styles[`handle_${direcao.replace('-', '_')}`]}`} onPointerDown={evento => iniciaResize(evento, passoId, bloco.idLocal, bloco.area, direcao)} />
            ))}
        </div>
    );
};

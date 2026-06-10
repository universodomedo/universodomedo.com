import styles from './BlocoTutorialView.module.css';

import type { AberturaTutorialPayload } from 'types-nora-api';
import MarkdownTutorial from 'Componentes/Elementos/MarkdownTutorial/MarkdownTutorial';

// Etapa 11: render apresentacional de UM Bloco render-ready (sem drag/resize/seleção). Imagem usa o caminho público já resolvido pelo backend; texto usa a política canônica de Markdown.
type BlocoRenderReady = AberturaTutorialPayload['tutorial']['passos'][number]['blocos'][number];

export default function BlocoTutorialView({ bloco }: { bloco: BlocoRenderReady }) {
    const estilo = { left: `${bloco.area.x}%`, top: `${bloco.area.y}%`, width: `${bloco.area.largura}%`, height: `${bloco.area.altura}%` };
    return (
        <div className={styles.bloco} style={estilo}>
            {bloco.tipo === 'imagem' && <img className={styles.imagem} src={bloco.caminhoPublico} alt="" draggable={false} />}
            {bloco.tipo === 'texto' && <MarkdownTutorial markdown={bloco.markdown} />}
        </div>
    );
};

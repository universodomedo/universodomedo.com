import styles from './PalcoTutorialView.module.css';

import type { ReactNode } from 'react';
import type { AberturaTutorialPayload } from 'types-nora-api';
import { RAZAO_ALTURA_CONTEUDO_TUTORIAL } from 'Uteis/tutorial/geometriaTutorialCompartilhada';
import BlocoTutorialView from './BlocoTutorialView';

// Etapa 11: reproduz a geometria consolidada do editor — palco (frame), coluna do Tutorial (larguraPercentual%), conteúdo rolável e canvas lógico (razão 1/RAZAO) com Blocos posicionados em %. Sem interatividade.
type PassoRenderReady = AberturaTutorialPayload['tutorial']['passos'][number];

export default function PalcoTutorialView({ larguraPercentual, passo, rodape }: { larguraPercentual: number; passo: PassoRenderReady; rodape: ReactNode }) {
    return (
        <div className={styles.palco}>
            <div className={styles.tutorial} style={{ width: `${larguraPercentual}%` }}>
                <div className={styles.conteudoScroll}>
                    <div className={styles.canvas} style={{ aspectRatio: `1 / ${RAZAO_ALTURA_CONTEUDO_TUTORIAL}` }}>
                        {passo.blocos.map((bloco, indice) => <BlocoTutorialView key={indice} bloco={bloco} />)}
                    </div>
                </div>
                <div className={styles.rodape}>{rodape}</div>
            </div>
        </div>
    );
};

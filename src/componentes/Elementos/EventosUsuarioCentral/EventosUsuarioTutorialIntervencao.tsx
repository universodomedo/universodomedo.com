'use client';

import styles from './tutorial.module.css';
import posicaoStyles from './tutorialPosicao.module.css';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';

// Intervenção visual mínima de tutorial (Etapa 12): só renderiza o item já preparado; lógica/estado no ContextoEventosUsuario.
// Etapa 16: renderiza o passo atual, o progresso e a navegação (Próximo/Entendi) já preparados pelo hook.
export default function EventosUsuarioTutorialIntervencao() {
    const { tutorialAberto, passoAtual, progressoRotulo, ehUltimoPasso, alvoVisualLocalizado, posicaoIntervencao, fecharTutorial, proximoPasso, confirmarTutorial } = useContextoEventosUsuario();

    if (!tutorialAberto || !passoAtual) return null;

    return (
        <div className={styles.camada} role="dialog" aria-modal="true">
            <div className={`${styles.painel} ${posicaoStyles[posicaoIntervencao]}`}>
                <div className={styles.progresso}>{progressoRotulo}</div>
                <div className={styles.titulo}>{passoAtual.titulo}</div>
                <div className={styles.mensagem}>{passoAtual.mensagem}</div>
                {passoAtual.textoAuxiliar && <div className={styles.texto_auxiliar}>{passoAtual.textoAuxiliar}</div>}
                {alvoVisualLocalizado && <div className={styles.alvo_indicacao}>Destacamos o botão de eventos na tela para você localizá-lo.</div>}
                <div className={styles.data}>{tutorialAberto.dataCriacaoFormatada}</div>
                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_secundario} onClick={fecharTutorial}>Fechar</button>
                    {ehUltimoPasso
                        ? <button type="button" className={styles.botao_primario} onClick={confirmarTutorial}>Entendi</button>
                        : <button type="button" className={styles.botao_primario} onClick={proximoPasso}>Próximo</button>}
                </div>
            </div>
        </div>
    );
};

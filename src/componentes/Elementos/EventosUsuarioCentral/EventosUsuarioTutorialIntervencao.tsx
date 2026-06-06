'use client';

import styles from './tutorial.module.css';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';

// Intervenção visual mínima de tutorial (Etapa 12): só renderiza o item já preparado; lógica/estado no ContextoEventosUsuario.
export default function EventosUsuarioTutorialIntervencao() {
    const { tutorialAberto, alvoVisualLocalizado, fecharTutorial, confirmarTutorial } = useContextoEventosUsuario();

    if (!tutorialAberto) return null;

    return (
        <div className={styles.camada} role="dialog" aria-modal="true">
            <div className={styles.painel}>
                <div className={styles.titulo}>{tutorialAberto.titulo}</div>
                <div className={styles.mensagem}>{tutorialAberto.mensagem}</div>
                {tutorialAberto.textoAuxiliar && <div className={styles.texto_auxiliar}>{tutorialAberto.textoAuxiliar}</div>}
                {alvoVisualLocalizado && <div className={styles.alvo_indicacao}>Destacamos o botão de eventos na tela para você localizá-lo.</div>}
                <div className={styles.data}>{tutorialAberto.dataCriacaoFormatada}</div>
                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_secundario} onClick={fecharTutorial}>Fechar</button>
                    <button type="button" className={styles.botao_primario} onClick={confirmarTutorial}>Entendi</button>
                </div>
            </div>
        </div>
    );
};

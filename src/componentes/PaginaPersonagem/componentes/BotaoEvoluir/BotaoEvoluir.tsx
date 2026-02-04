'use client';

import styles from './styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';
import { PAGINA_PERSONAGEM } from 'Componentes/PaginaPersonagem/types';

export default function BotaoEvoluir() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();
    const { navegarPara } = useContextoPaginaPersonagem();

    return (personagemSelecionado?.temCriacaoPendente || personagemSelecionado?.temEvolucaoPendente) && (
        <div id={styles.recipiente_botao_evoluir}>
            <button onClick={() => navegarPara(PAGINA_PERSONAGEM.EVOLUIR)}>{personagemSelecionado?.temCriacaoPendente ? `Criar` : `Evoluir`}</button>
        </div>
    );
};
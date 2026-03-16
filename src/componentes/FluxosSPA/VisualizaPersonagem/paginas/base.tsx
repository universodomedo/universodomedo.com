import styles from '../styles.module.css';

import { useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';
import { PAGINA_PERSONAGEM } from '../types';
import BarraPersonagem from 'Componentes/ElementosVisuais/BarraPersonagem/BarraPersonagem'
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export default function SPA__PaginaPersonagem__Base({ children }: { children: React.ReactNode; }) {
    const { navegarPara, personagem } = useContextoPaginaPersonagem();

    return (
        <div className={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <BarraPersonagem props={{ personagem }} />
            <div className={styles.botoes_subpaginas_personagem}>
                <button onClick={() => navegarPara(PAGINA_PERSONAGEM.INICIAL)}>Geral</button>
                <button onClick={() => navegarPara(PAGINA_PERSONAGEM.EXIBIR_FICHA)}>Ficha</button>
            </div>
            <SecaoDeConteudo className={styles.recipiente_subconteudo_pagina_personagem_selecionado}>
                {children}
            </SecaoDeConteudo>
        </div>
    );
};
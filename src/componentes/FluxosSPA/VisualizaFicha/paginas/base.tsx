import styles from '../styles.module.css';

import { useContextoPaginaFichaTemporaria } from 'Contextos/ContextoPaginaFichaTemporaria/contexto';
import BarraFichaTemporaria from 'Componentes/ElementosVisuais/BarraFichaTemporaria/BarraFichaTemporaria';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export default function SPA__PaginaFichaTemporaria__Base({ children }: { children: React.ReactNode; }) {
    const { navegarPara, fichaTemporaria } = useContextoPaginaFichaTemporaria();

    return (
        <div className={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <BarraFichaTemporaria props={{ fichaTemporaria }} />
            <div className={styles.botoes_subpaginas_personagem}>
                <button onClick={() => navegarPara('INICIAL')}>Geral</button>
                <button onClick={() => navegarPara('EXIBIR_FICHA')}>Ficha</button>
            </div>
            <SecaoDeConteudo className={styles.recipiente_subconteudo_pagina_personagem_selecionado}>
                {children}
            </SecaoDeConteudo>
        </div>
    );
};
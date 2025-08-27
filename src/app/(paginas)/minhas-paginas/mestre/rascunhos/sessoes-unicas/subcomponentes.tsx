'use client';

import styles from '../styles.module.css';

import { useContextoMestreRascunhosSessoesUnicas } from 'Contextos/ContextoMestreRascunhosSessoesUnicas/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export function RascunhoSessaoUnicaMestre_Conteudo() {
    const {  } = useContextoMestreRascunhosSessoesUnicas();

    const lista: string[] = [
        'teste1',
        'teste2',
        'teste3',
    ];

    return (
        <div id={styles.recipiente_area_rascunhos}>
            <DivClicavel id={styles.botao_novo_rascunho}>
                <h3>Novo Rascunho</h3>
            </DivClicavel>

            <div id={styles.recipiente_rascunhos}>
                {lista.map((item, index) => (
                    <div key={index} className={styles.recipiente_item_rascunho}>
                        <h4>{item}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};
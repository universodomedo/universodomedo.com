'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaJogadorCriaFicha } from 'Contextos/ContextoPaginaJogadorCriaFicha/contexto';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import redirecionarInterno from 'Funcionalidades/redirecionarInterno';

export default function SPA_PaginaJogadorCriarFicha_Inicial() {
    const { navegarPara, nomeFicha, setNomeFicha, descricaoFicha, setDescricaoFicha, podeComecarCriacao } = useContextoPaginaJogadorCriaFicha();

    return (
        <div className={styles.recipiente_criar_ficha_conteudo}>
            <div className={styles.recipiente_criar_ficha_conteudo_principal}>
                <div className={styles.recipiente_botoes_criar_ficha}>
                    <button>Botão 1</button>
                    <button disabled>Botão 2</button>
                </div>
                <div className={styles.recipiente_detalhes_criar_ficha}>
                    <InputComRotulo rotulo={'Nome da Ficha'}>
                        <input type='text' placeholder='Nome Ficha' value={nomeFicha} onChange={(e) => setNomeFicha(e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo={'Descrição da Ficha'}>
                        <input type='text' placeholder='Descrição Ficha' value={descricaoFicha} onChange={(e) => setDescricaoFicha(e.target.value)} />
                    </InputComRotulo>
                </div>
            </div>
            <div className={styles.recipiente_botoes_acoes_criar_ficha}>
                <button onClick={() => redirecionarInterno(PAGINAS.minhasPaginas.jogador)}>Cancelar</button>
                <button disabled={!podeComecarCriacao} onClick={() => navegarPara('EVOLUCAO_INICIAL')}>Criar</button>
            </div>
        </div>
    );
};
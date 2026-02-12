'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaJogadorCriaFicha } from 'Contextos/ContextoPaginaJogadorCriaFicha/contexto';
import BotaoCriacao from 'Componentes/ElementosVisuais/BotaoCriacao/BotaoCriacao';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import redirecionarInterno from 'Funcionalidades/redirecionarInterno';

export default function SPA_PaginaJogadorCriarFicha_Inicial() {
    const { navegarPara, nomeFicha, setNomeFicha, descricaoFicha, setDescricaoFicha, modoCriacao, selecionarModoCriacao, podeComecarCriacao } = useContextoPaginaJogadorCriaFicha();

    return (
        <div className={styles.recipiente_criar_ficha_conteudo}>
            <div className={styles.recipiente_criar_ficha_conteudo_principal}>
                <div className={styles.recipiente_botoes_criar_ficha}>
                    <BotaoCriacao arquivoImagem={'BOTAO_CRIACAO__FICHA__IMAGEM__CRIA'} texto={'Nova Ficha'} ativo={modoCriacao === 'NOVA_FICHA'} onClick={() => selecionarModoCriacao('NOVA_FICHA')} />
                    <BotaoCriacao bloqueadoTemporariamente arquivoImagem={'BOTAO_CRIACAO__FICHA__IMAGEM__COPIA'} texto={'Clonar Personagem'} espelhar ativo={modoCriacao === 'CLONAR_FICHA_PERSONAGEM'} onClick={() => selecionarModoCriacao('CLONAR_FICHA_PERSONAGEM')} />
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
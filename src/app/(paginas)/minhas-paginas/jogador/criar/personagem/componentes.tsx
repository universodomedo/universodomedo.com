'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import BotaoCriacao from 'Componentes/ElementosVisuais/BotaoCriacao/BotaoCriacao';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export function PaginaJogadorCriarPersonagem_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.criar.personagem}>
            <div className={styles.recipiente_criar_ficha_conteudo}>
                <div className={styles.recipiente_criar_ficha_conteudo_principal}>
                    <div className={styles.recipiente_botoes_criar_ficha}>
                        <BotaoCriacao bloqueadoTemporariamente arquivoImagem={'BOTAO_CRIACAO__PERSONAGEM__IMAGEM__NOVO'} texto={'Novo Personagem'} ativo={true} />
                        <BotaoCriacao bloqueadoTemporariamente arquivoImagem={'BOTAO_CRIACAO__PERSONAGEM__IMAGEM__COPIA'} texto={'Usar Ficha'} espelhar ativo={true} />
                    </div>
                    <div className={styles.recipiente_detalhes_criar_ficha}>
                        <h1>Você não possui nenhuma Chave de Criação de Personagem</h1>
                        <LinkInterno destino={{ pagina: PAGINAS.minhasPaginas.jogador }}>Voltar</LinkInterno>
                    </div>
                </div>
            </div>
        </ControladorSlot>
    );
};
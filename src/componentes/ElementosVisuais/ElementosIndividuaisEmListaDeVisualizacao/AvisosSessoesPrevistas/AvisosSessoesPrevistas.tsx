'use client';

import styles from './styles.module.css';

import { VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import ItemListagemSessaoPrevistaComParticipante from '../ItemListagemSessaoPrevistaComParticipante/ItemListagemSessaoPrevistaComParticipante';

export default function AvisosSessoesPrevistas({ sessoes, selecionaSessao }: { sessoes: VIEW_SessaoDeJogadorDto[]; selecionaSessao: (idSessao: number) => void; }) {
    return (
        <SecaoDeConteudo className={styles.recipiente_avisos_sessoes_previstas}>
            {sessoes.length < 1 ? (
                <h2>Você não tem nenhuma Sessão prevista</h2>
            ) : (
                <div className={styles.recipiente_listagem_sessoes_jogador}>
                    <h1>Suas Sessões</h1>
                    {sessoes.map(sessao => <ItemListagemSessaoPrevistaComParticipante key={sessao.id} sessao={sessao} selecionaSessao={selecionaSessao} />)}
                </div>
            )}
        </SecaoDeConteudo>
    );
};
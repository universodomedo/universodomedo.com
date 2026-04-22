'use client';

import styles from '../styles.module.css';

import { JSX } from 'react';
import { CAPACIDADES, VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoPaginaPersonagens } from "Contextos/ContextoPaginaPersonagens/contexto";
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function ListaAcoesPersonagens() {
    const { verificarCapacidade } = useContextoAutenticacao();
    const { personagens } = useContextoPaginaPersonagens();

    return (
        <div id={styles.recipiente_lista_acoes}>
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Buscar Personagem</h2>
            </div>

            <SecaoPersonagens titulo={"Personagens - Jogador"} personagens={personagens.filter(personagem => personagem.tipoPersonagem === 'PERSONAGEM_DE_JOGADOR')} />

            {verificarCapacidade(CAPACIDADES.MESTRE__CRIACAO__SESSAO_DE_JOGO) && (
                <SecaoPersonagens titulo={"Personagens - Mestre"} personagens={personagens.filter(personagem => personagem.tipoPersonagem === 'PERSONAGEM_DE_MESTRE')} />
            )}
        </div>
    );
};

function SecaoPersonagens({ titulo, personagens }: { titulo: string; personagens: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[]; }) {
    return (
        <>
            <hr className={styles.divisor} />
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>{titulo}</h2>
                <div className={styles.recipiente_lista_avatares_personagens}>
                    {personagens.length < 1 ? (
                        <h3>Nenhum personagem presente</h3>
                    ) : (
                        <>
                            {personagens.map(personagem => <RenderPersonagem key={personagem.id} personagem={personagem} /> )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

function RenderPersonagem({ personagem }: { personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto }): JSX.Element {
    const { setIdPersonagemSelecionado, personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <DivClicavel key={personagem.id} className={styles.recipiente_avatar_personagem} classeParaDesabilitado={styles.avatar_personagem_selecionado} desabilitado={personagem.id === personagemSelecionado?.id} onClick={() => setIdPersonagemSelecionado(personagem.id)}>
            <RenderArquivoAvatar caminhoArquivoAvatar={personagem.avatarAtual} />
            {/* {(personagem.temCriacaoPendente || personagem.temEvolucaoPendente) && (
                <div className={styles.recipiente_item_menu_com_pendencia}>
                    <span className={styles.numero_pendencias}>!</span>
                </div>
            )} */}
        </DivClicavel>
    );
};
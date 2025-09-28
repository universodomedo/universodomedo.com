'use client';

import styles from '../styles.module.css';
import { JSX } from 'react';
import { PersonagemDto } from 'types-nora-api';

import { useContextoPaginaPersonagens } from "Contextos/ContextoPaginaPersonagens/contexto";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export default function ListaAcoesPersonagens() {
    const { personagens } = useContextoPaginaPersonagens();

    const personagensJogador = personagens.filter(personagem => personagem.tipoPersonagem.id === 1);
    const personagensMestre = personagens.filter(personagem => personagem.tipoPersonagem.id === 2);

    return (
        <div id={styles.recipiente_lista_acoes}>
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Buscar Personagem</h2>
            </div>
            <hr className={styles.divisor} />
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Personagens - Jogador</h2>
                <div className={styles.recipiente_lista_avatares_personagens}>
                    {personagensJogador.map(personagem => RenderPersonagem(personagem))}
                </div>
            </div>
            <hr className={styles.divisor} />
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Personagens - Mestre</h2>
                <div className={styles.recipiente_lista_avatares_personagens}>
                    {personagensMestre.map(personagem => RenderPersonagem(personagem))}
                </div>
            </div>
        </div>
    );
};

function RenderPersonagem(personagem: PersonagemDto): JSX.Element {
    const { setIdPersonagemSelecionado, personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <DivClicavel key={personagem.id} className={styles.recipiente_avatar_personagem} classeParaDesabilitado={styles.avatar_personagem_selecionado} desabilitado={personagem.id === personagemSelecionado?.id} onClick={() => setIdPersonagemSelecionado(personagem.id)}>
            <RecipienteImagem src={personagem.caminhoAvatar} />
            {(personagem.temCriacaoPendente || personagem.temEvolucaoPendente) && (
                <div className={styles.recipiente_item_menu_com_pendencia}>
                    <span className={styles.numero_pendencias}>!</span>
                </div>
            )}
        </DivClicavel>
    );
};
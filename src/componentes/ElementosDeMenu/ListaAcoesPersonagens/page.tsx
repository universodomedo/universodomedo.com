'use client';

import styles from '../styles.module.css';

import { useContextoPaginaPersonagens } from "Contextos/ContextoPaginaPersonagens/contexto";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

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
                    {personagensJogador.map(personagem => (
                        <div key={personagem.id} className={styles.recipiente_avatar_personagem}>
                            <RecipienteImagem src={personagem.caminhoAvatar} />
                        </div>
                    ))}

                </div>
            </div>
            <hr className={styles.divisor} />
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Personagens - Mestre</h2>
                <div className={styles.recipiente_lista_avatares_personagens}>
                    {personagensMestre.map(personagem => (
                        <div key={personagem.id} className={styles.recipiente_avatar_personagem}>
                            <RecipienteImagem src={personagem.caminhoAvatar} />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};
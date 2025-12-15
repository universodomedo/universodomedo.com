'use client';

import styles from '../styles.module.css';
import { JSX } from 'react';
import { PersonagemDto } from 'types-nora-api';

import { useContextoPaginaPersonagens } from "Contextos/ContextoPaginaPersonagens/contexto";
import { verificarPermissao } from 'Helpers/verificarPermissao';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export default function ListaAcoesPersonagens() {
    const { personagens } = useContextoPaginaPersonagens();

    return (
        <div id={styles.recipiente_lista_acoes}>
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Buscar Personagem</h2>
            </div>

            <SecaoPersonagens titulo={"Personagens - Jogador"} personagens={personagens.filter(personagem => personagem.tipoPersonagem.id === 1)} />

            {verificarPermissao(usuario => usuario.perfilMestre.id > 1) && (
                <SecaoPersonagens titulo={"Personagens - Mestre"} personagens={personagens.filter(personagem => personagem.tipoPersonagem.id === 2)} />
            )}
        </div>
    );
};

function SecaoPersonagens({ titulo, personagens }: { titulo: string; personagens: PersonagemDto[]; }) {
    return (
        <>
            <hr className={styles.divisor} />
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>{titulo}</h2>
                <div className={styles.recipiente_lista_avatares_personagens}>
                    {personagens.length < 1 ? (
                        <h3>nenhum personagem presente</h3>
                    ) : (
                        <>
                            {personagens.map(personagem => (
                                <RenderPersonagem key={personagem.id} personagem={personagem} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

function RenderPersonagem({ personagem }: { personagem: PersonagemDto }): JSX.Element {
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
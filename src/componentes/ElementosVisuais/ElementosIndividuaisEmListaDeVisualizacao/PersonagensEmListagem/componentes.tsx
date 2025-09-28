'use client';

import styles from './styles.module.css';

import { FichaPersonagemDto } from 'types-nora-api';

import { useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

export function ListaPersonagens() {
    const { personagens } = useContextoListagemPersonagens();
    
    return (
        <div id={styles.recipiente_lista_personagens}>
            {personagens!.map(personagem => (
                <SecaoDeConteudo key={personagem.id} className={styles.secao_conteudo_recipiente_personagem}>
                    <CustomLink className={styles.recipiente_personagem} semDecoracao inlineBlock={false} href={`/personagens?${QUERY_PARAMS.PERSONAGEM}=${personagem.id}`}>
                        <div className={styles.recipiente_avatar_personagem}>
                            <RecipienteImagem src={personagem.caminhoAvatar} />
                        </div>
                        <div className={styles.recipiente_informacoes1_personagem}>
                            <div className={styles.recipiente_informacoes_personagem}>
                                <div className={styles.recipiente_nome_personagem}>
                                    <h1>{personagem.informacao?.nome}</h1>
                                    {personagem.pendencias.pendeciaUsuario !== '' && (<div className={styles.recipiente_pendencia}>{personagem.pendencias.pendeciaUsuario}</div>)}
                                </div>
                                {personagem.fichaVigente && (<div className={styles.recipiente_classe_e_nivel_personagem}><DetalheClasseENivel ficha={personagem.fichaVigente} /></div>)}
                            </div>
                        </div>
                        {personagem.tempoProximaSessaoPersonagem !== undefined && (
                            <div className={styles.recipiente_informacoes2_personagem}>
                                <h2>{personagem.tempoProximaSessaoPersonagem}</h2>
                            </div>
                        )}
                    </CustomLink>
                </SecaoDeConteudo>
            ))}
        </div>
    );
};

function DetalheClasseENivel({ ficha }: { ficha: FichaPersonagemDto }) {
    return (<h2>{`${ficha.fichaDeJogo.classe.nome} - ${ficha.nivel.nomeVisualizacao}`}</h2>);
};
'use client';

import styles from '../styles.module.css';

import { EstadoPendenciaAdministrativaPersonagem, EstadoPendenciaPersonagem, FichaPersonagemDto, PersonagemDto } from 'types-nora-api';
import { useContextoJogadorPersonagens } from 'Contextos/ContextoJogadorPersonagens/contexto.tsx';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import Link from 'next/link';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export function PaginaListaPersonagens() {
    const { personagensDoUsuario } = useContextoJogadorPersonagens();

    if (!personagensDoUsuario || personagensDoUsuario.length < 1) return <div>Erro ao carregar personagens</div>;

    return <PaginaListaPersonagensComDados />
};

function PaginaListaPersonagensComDados() {
    return (
        <>
            {/* <div className={styles.recipiente_avisos_convite_pendentes}>
                <h1>Você tem um convite pendente!</h1>
                <h1>O Mestre Vigiani te convidou para jogar <Link href={'/aventuras'} target='_blank'>Profunda Herança</Link></h1>
                <div className={styles.recipiente_botoes_aviso_convite_pendente}>
                    <button>Aceitar</button>
                    <button>Rejeitar</button>
                </div>
            </div> */}
            <ListaPersonagens />
        </>
    );
};

function ListaPersonagens() {
    const { personagensDoUsuario, buscaDadosPersonagemSelecionado } = useContextoJogadorPersonagens();

    function selecionaPersonagem(idPersonagem: number) {
        buscaDadosPersonagemSelecionado(idPersonagem);
    }

    if (personagensDoUsuario!.length < 1) return (
        <div>
            <h2>Nenhum Personagem foi encontrado</h2>
            <Link href={'/dicas/criando-um-novo-personagem'} target='_blank'><h2>Maiores informações sobre o Cadastro de Personagens</h2></Link>
        </div>
    );

    return (
        <div id={styles.recipiente_lista_personagens}>
            {personagensDoUsuario!.map(personagem => (
                <div key={personagem.id} className={styles.recipiente_personagem} onClick={() => selecionaPersonagem(personagem.id)}>
                    <div className={styles.recipiente_avatar_personagem}>
                        <RecipienteImagem src={personagem.imagemAvatar?.fullPath} />
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
                </div>
            ))}
        </div>
    );
};

function DetalheClasseENivel({ ficha }: { ficha: FichaPersonagemDto }) {
    return (<h2>{`${ficha.fichaDeJogo.classe.nome} - ${ficha.nivel.nomeVisualizacao}`}</h2>);
};
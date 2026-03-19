'use client';

import styles from './styles.module.css';

import { FichaTemporariaExibicaoDto, JogadorSessaoDto, PAGINAS, PersonagemExibicaoDto, TipoSessao, TipoVinculoSessaoJogador } from 'types-nora-api';

import { useContextoVincularJogadorSessao } from "Contextos/ContextoVincularJogadorSessaoProvider/contexto";
import { CabecalhoDeAventura } from "Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page";
import { DadosResumo } from "Componentes/Elementos/DetalhesRascunho/subcomponentes";
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteSelecionarFichaSessaoUnica from 'Componentes/ElementosPaginaUsuario/RecipienteSelecionarFichaSessaoUnica/RecipienteSelecionarFichaSessaoUnica';

export default function SPA__PaginaJogador__SelecionandoFichaParaSessao() {
    const { sessao } = useContextoVincularJogadorSessao();

    return (
        <>
            <CabecalhoDeAventura tipo={'sessao'} caminhoCapaSessao={sessao.imagemCapa.caminhoCapa} />
            <DadosDeParticipacaoDesseUsuarioNessaSessao jogadorSessao={sessao.jogadorSessao} />
            {sessao.tipoSessao !== TipoSessao.AVENTURA && sessao.rascunhoSessaoUnica && (
                <div className={styles.recipiente_descricao_sessao}>
                    <DadosResumo rascunho={sessao.rascunhoSessaoUnica} />
                </div>
            )}
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao({ jogadorSessao }: { jogadorSessao: JogadorSessaoDto }) {
    return (
        <SecaoDeConteudo className={styles.recipiente_secao_participante} fit>
            {
                jogadorSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.FICHA_TEMPORARIA_PENDENTE ? <DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Pendente />
                : jogadorSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? <DadosDeParticipacaoDesseUsuarioNessaSessao__Personagem personagem={jogadorSessao.personagemDoJogador} />
                : <DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Selecionada fichaTemporaria={jogadorSessao.fichaTemporariaDoJogador} />
            }
        </SecaoDeConteudo>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Personagem({ personagem }: { personagem: PersonagemExibicaoDto }) {
    return (
        <>
            <h1>Você vai jogar com esse Personagem</h1>
            <div className={styles.recipiente_dados_participante}>
                <h3>{personagem.nome}</h3>
                <div className={styles.recipiente_avatar_seu_personagem_participante_dessa_sessao}>
                    <RecipienteImagem src={personagem.caminhoAvatar} />
                </div>
            </div>
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Selecionada({ fichaTemporaria }: { fichaTemporaria: FichaTemporariaExibicaoDto }) {
    return (
        <>
            <h1>Você vai jogar com essa Ficha</h1>
            <div className={styles.recipiente_dados_participante}>
                <h3>{fichaTemporaria.nome}</h3>
            </div>
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Pendente() {
    const { sessao, fichasUsuario } = useContextoVincularJogadorSessao();

    return (
        <>
            <h1>Você ainda não selecionou nenhuma Ficha para participar dessa Sessão</h1>

            {fichasUsuario.length > 0 ? (
                <RecipienteSelecionarFichaSessaoUnica sessao={sessao} fichas={fichasUsuario} />
            ) : (
                <LinkInterno destino={{ pagina: PAGINAS.minhasPaginas.jogador.criar.ficha }} >
                    <>
                        <h2>Você não possui nenhuma ficha no momento</h2>
                        <h3>Crie aqui sua ficha!</h3>
                    </>
                </LinkInterno>
            )}
        </>
    );
};
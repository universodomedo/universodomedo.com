'use client';

import styles from './styles.module.css';

import { DadosParticipanteJogo, FichaDto, PAGINAS, PersonagemSalaJogoDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoPaginaJogador__SelecionandoFichaParaSessao } from "Contextos/ContextoPaginaJogador__SelecionandoFichaParaSessao/contexto";
import { CabecalhoDeAventura } from "Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page";
import { DadosResumo } from "Componentes/Elementos/DetalhesRascunho/subcomponentes";
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteSelecionarFichaSessaoUnica from 'Componentes/ElementosPaginaUsuario/RecipienteSelecionarFichaSessaoUnica/RecipienteSelecionarFichaSessaoUnica';

export default function SPA__PaginaJogador__SelecionandoFichaParaSessao() {
    const { usuarioLogado } = useContextoAutenticacao();
    const { sessao } = useContextoPaginaJogador__SelecionandoFichaParaSessao();
    const participante = sessao.dadosGerais?.participantes.find(participante => participante.jogador.id === usuarioLogado?.id)!.dadosParticipanteJogo!;

    return (
        <>
            <CabecalhoDeAventura tipo={'sessao'} sessao={sessao} />
            <DadosDeParticipacaoDesseUsuarioNessaSessao participante={participante} />
            {sessao.detalheSessaoUnica && sessao.detalheSessaoUnica.rascunho && (
                <div className={styles.recipiente_descricao_sessao}>
                    <DadosResumo rascunho={sessao.detalheSessaoUnica.rascunho} />
                </div>
            )}
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao({ participante }: { participante: DadosParticipanteJogo }) {
    return (
        <SecaoDeConteudo className={styles.recipiente_secao_participante} fit>
            {participante.personagem ?
                <DadosDeParticipacaoDesseUsuarioNessaSessao__Personagem personagem={participante.personagem} />
                : <DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha ficha={participante.ficha} />
            }
        </SecaoDeConteudo>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Personagem({ personagem }: { personagem: PersonagemSalaJogoDto }) {
    return (
        <>
            <h1>Você vai jogar com esse Personagem</h1>
            <div className={styles.recipiente_dados_participante}>
                <h3>{personagem.informacao.nome}</h3>
                <div className={styles.recipiente_avatar_seu_personagem_participante_dessa_sessao}>
                    <RecipienteImagem src={personagem.caminhoAvatar} />
                </div>
            </div>
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha({ ficha }: { ficha: FichaDto | null }) {
    return (
        <>
            {ficha ? <DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Selecionada ficha={ficha} /> : <DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Pendente />}
        </>
    );
};


function DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Selecionada({ ficha }: { ficha: FichaDto }) {
    return (
        <>
            <h1>Você vai jogar com essa Ficha</h1>
            <div className={styles.recipiente_dados_participante}>
                <h3>{ficha.fichaTemporaria?.nome}</h3>
            </div>
        </>
    );
};

function DadosDeParticipacaoDesseUsuarioNessaSessao__Ficha__Pendente() {
    const { fichas } = useContextoPaginaJogador();
    const { sessao } = useContextoPaginaJogador__SelecionandoFichaParaSessao();

    return (
        <>
            <h1>Você ainda não selecionou nenhuma Ficha para participar dessa Sessão</h1>

            {fichas.length > 0 ? (
                <RecipienteSelecionarFichaSessaoUnica sessao={sessao} fichas={fichas} />
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
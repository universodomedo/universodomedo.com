import styles from './styles.module.css';

import { FormatoMomento, ParticipanteSessao_Tipo, SessaoCompletaDto, TipoVinculoSessaoJogador } from 'types-nora-api';

import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import PersonagemEmVisualizacaoDeSessao from '../ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';

export default function SessaoEmVisualizacao({ sessao }: { sessao: SessaoCompletaDto }) {
    return (
        <div className={styles.recipiente_sessao_selecionada}>
            <CabecalhoDeAventura tipo={'sessao'} caminhoCapaSessao={sessao.imagemCapa.caminhoCapa} />

            <SecaoDeConteudo fit>
                {sessao.duracaoEmSegundos && (<h4>Duração: {formataDuracao(sessao.duracaoEmSegundos, FormatoMomento.HMS)}</h4>)}
            </SecaoDeConteudo>

            <SecaoDeConteudo className={styles.recipiente_avatares}>
                <h2>Mestre</h2>

                <PersonagemEmVisualizacaoDeSessao tipo={'mestre'} usuario={sessao.usuarioMestre} />
            </SecaoDeConteudo>

            <SecaoDeConteudo className={styles.recipiente_avatares}>
                <h2>Participantes</h2>

                <div className={styles.recipiente_avatares_jogadores}>
                    {sessao.participantes.filter(participante => participante.tipoParticipante === ParticipanteSessao_Tipo.JOGADOR).sort((a, b) => obtemPrioridadeVinculoJogador(a.tipoVinculoSessaoJogador) - obtemPrioridadeVinculoJogador(b.tipoVinculoSessaoJogador)).map(participante => (
                        <PersonagemEmVisualizacaoDeSessao key={participante.usuario.id} tipo={'participante'} participanteSessao={participante} />
                    ))}
                </div>
            </SecaoDeConteudo>
        </div>
    );
};

function obtemPrioridadeVinculoJogador(tipoVinculoSessaoJogador: TipoVinculoSessaoJogador): number {
    switch (tipoVinculoSessaoJogador) {
        case TipoVinculoSessaoJogador.PERSONAGEM:
            return 0;
        case TipoVinculoSessaoJogador.FICHA_TEMPORARIA:
            return 1;
        case TipoVinculoSessaoJogador.FICHA_TEMPORARIA_PENDENTE:
            return 2;
    }
};
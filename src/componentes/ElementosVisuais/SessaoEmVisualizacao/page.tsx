import styles from './styles.module.css';

import { FormatoMomento, SessaoCompletaDto } from 'types-nora-api';

import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import PersonagemEmVisualizacaoDeSessao from '../ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';

export default function SessaoEmVisualizacao({ sessao }: { sessao: SessaoCompletaDto }) {
    return (
        <div id={styles.recipiente_sessao_selecionada}>
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

                <div id={styles.recipiente_avatares_jogadores}>
                    {/* to do */}
                    {/* {sessao.dadosGerais!.participantes.filter(participante => participante.jogador).sort((a, b) => Number(b.dadosParticipanteJogo.personagem !== null) - Number(a.dadosParticipanteJogo.personagem !== null)).map(participante => (
                        <PersonagemEmVisualizacaoDeSessao key={participante.jogador?.id} tipo={'participante'} participanteSessao={participante} />
                    ))} */}
                </div>
            </SecaoDeConteudo>
        </div>
    );
};
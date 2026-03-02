import styles from './styles.module.css';

import { DadosParticipanteJogo, PAGINAS, SessaoDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';

export default function ItemListagemSessaoPrevistaComParticipante({ sessao }: { sessao: SessaoDto }) {
    // to do PRIORITARIO: Não receber a sessão com todos os participantes e filtrar apenas o seu
    // e sim um novo DTO de SessaoComParticipante, apenas com o objeto correto
    const { usuarioLogado } = useContextoAutenticacao();
    const { setIdSessaoEmFoco } = useContextoPaginaJogador();

    return (
        <DivClicavel className={styles.recipiente_item_listagem_sessoes_jogador} onClick={() => { setIdSessaoEmFoco(sessao.id); }}>
            <div className={styles.recipiente_capa_item_sessoes_jogador}>
                <RecipienteImagem src={sessao.imagemCapa.caminhoCapa} />
            </div>
            <div className={styles.recipiente_informacaoes_sessao}>
                <h2>{sessao.tituloInteligente.titulo}</h2>
                {sessao.tituloInteligente.subtitulo && (<h4>{sessao.tituloInteligente.subtitulo}</h4>)}
                <h3>{formataData(sessao.dataPrevisaoInicio)}</h3>
            </div>
            <div className={styles.recipiente_informacaoes_participante}>
                <DadosParticipanteSessao dadosParticipanteJogo={sessao.dadosGerais?.participantes.find(participante => participante.jogador.id === usuarioLogado?.id)!.dadosParticipanteJogo!} />
            </div>
        </DivClicavel>
    );
};

function DadosParticipanteSessao({ dadosParticipanteJogo }: { dadosParticipanteJogo: DadosParticipanteJogo }) {
    return (
        <>
            <h3>{dadosParticipanteJogo.personagem ? 'Personagem Participante' : 'Ficha Selecionada'}</h3>
            <div className={styles.recipiente_participante_sessao}>
                {dadosParticipanteJogo.personagem ? (
                    <div className={styles.recipiente_avatar_personagem_participante_sessao}>
                        <RecipienteImagem src={dadosParticipanteJogo.personagem?.caminhoAvatar} />
                    </div>
                ) : (
                    <div className={styles.recipiente_estado_ficha_participante_sessao}>
                        {dadosParticipanteJogo.ficha ? (
                            <h4>Ficha Selecionada</h4>
                        ) : (
                            <h4>Nenhuma ficha selecionada</h4>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
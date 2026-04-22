import styles from './styles.module.css';

import { JogadorSessaoDto, TipoVinculoSessaoJogador, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { RenderArquivoArteCapa, RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export default function ItemListagemSessaoPrevistaComParticipante({ sessao, selecionaSessao }: { sessao: VIEW_SessaoDeJogadorDto; selecionaSessao: (idSessao: number) => void; }) {
    return (
        <DivClicavel className={styles.recipiente_item_listagem_sessoes_jogador} onClick={() => { selecionaSessao(sessao.id); }}>
            <div className={styles.recipiente_capa_item_sessoes_jogador}>
                <RenderArquivoArteCapa caminhoArquivoArte={sessao.dadosArteCapa.caminhoArquivoArteCapa} />
            </div>
            <div className={styles.recipiente_informacaoes_sessao}>
                <h2>{sessao.tituloInteligente.titulo}</h2>
                {sessao.tituloInteligente.subtitulo && (<h4>{sessao.tituloInteligente.subtitulo}</h4>)}
                <h3>{formataData(sessao.dataPrevisaoInicio)}</h3>
            </div>
            <div className={styles.recipiente_informacaoes_participante}>
                <DadosParticipanteSessao jogadorSessao={sessao.jogadorSessao} />
            </div>
        </DivClicavel>
    );
};

function DadosParticipanteSessao({ jogadorSessao }: { jogadorSessao: JogadorSessaoDto }) {
    return (
        <>
            <h3>{jogadorSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? 'Personagem Participante' : 'Ficha Selecionada'}</h3>
            <div className={styles.recipiente_participante_sessao}>
                {jogadorSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? (
                    <div className={styles.recipiente_avatar_personagem_participante_sessao}>
                        <RenderArquivoAvatar caminhoArquivoAvatar={jogadorSessao.personagemDoJogador.avatarAtual} />
                    </div>
                ) : (
                    <div className={styles.recipiente_estado_ficha_participante_sessao}>
                        {jogadorSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.FICHA_TEMPORARIA ? (
                            <h4>Ficha Selecionada</h4>
                        ) : (
                            <h4 className={styles.mensagem_de_pendencia_de_ficha}>Nenhuma ficha selecionada</h4>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
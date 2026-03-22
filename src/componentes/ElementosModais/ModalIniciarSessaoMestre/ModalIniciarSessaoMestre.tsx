'use client';

import styles from './styles.module.css';

import { JogadorSessaoDto, minutosParaMs, ParticipanteSessao_Tipo, PathTokenPadrao, TipoVinculoSessaoJogador, UsuarioVisualizacaoSimplesDto, VIEW_SessaoComParticipantesDto } from 'types-nora-api';

import { useContextoSessoesMestreEmEspera } from 'Contextos/ContextoSessoesMestreEmEspera/contexto';
import { useContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import RecipienteCapa from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RecipienteCapa/page';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

const dezMinMs = minutosParaMs(10);
const trintaMinMs = minutosParaMs(30);

export default function ModalIniciarSessaoMestre({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { sessaoSelecionada, executaIniciaSessao } = useContextoSessoesMestreEmEspera();

    const dataAlvo = sessaoSelecionada?.dataPrevisaoInicio ?? Date.now();
    const { tempoRestante, diferencaMs } = useContadorRegressivo({ dataAlvo });

    // const podeIniciar = !Number.isNaN(diferencaMs) && diferencaMs <= dezMinMs && diferencaMs >= -trintaMinMs;
    const podeIniciar = true;

    if (!sessaoSelecionada) return null;

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Mestre: Iniciando Sessão', subtitulo: sessaoSelecionada.tituloSessao }} botaoAcaoPrincipal={{ execucao: () => { executaIniciaSessao(); }, desabilitado: !podeIniciar, texto: 'Iniciar Sessão' }}>
                <ConteudoModal sessao={sessaoSelecionada} diferencaMs={diferencaMs} tempoRestante={tempoRestante} />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal({ sessao, diferencaMs, tempoRestante }: { sessao: VIEW_SessaoComParticipantesDto; diferencaMs: number; tempoRestante: string; }) {
    return (
        <div className={styles.recipiente_dados_sessao}>
            <RecipienteCapa caminhoCapa={sessao.imagemCapa.caminhoCapa} />
            <h3>Previsão: {formataData(sessao.dataPrevisaoInicio, 'dd/MM/yyyy HH:mm')}</h3>
            <DadosPrevisao diferencaMs={diferencaMs} tempoRestante={tempoRestante} />
            <DadosParticipantes sessao={sessao} />
        </div>
    );
};

function DadosPrevisao({ diferencaMs, tempoRestante }: { diferencaMs: number, tempoRestante: string }) {
    let mensagem = '';

    if (!Number.isNaN(diferencaMs)) {
        if (diferencaMs > dezMinMs) mensagem = `Você poderá iniciar essa sessão em ${tempoRestante}`;
        if (diferencaMs <= dezMinMs && diferencaMs >= -trintaMinMs) mensagem = 'Você pode iniciar essa sessão agora!';
        if (diferencaMs < -trintaMinMs) mensagem = 'Essa sessão atrasou e não pode mais ser iniciada';
    }

    return mensagem ? (<h3>{mensagem}</h3>) : (<></>);
};

function DadosParticipantes({ sessao }: { sessao: VIEW_SessaoComParticipantesDto; }) {
    return (
        <div className={styles.recipiente_participantes_sessao_modal_sessao}>
            <h2>Participantes</h2>
            {sessao.participantes.filter(participante => participante.tipoParticipante === ParticipanteSessao_Tipo.JOGADOR).map(jogador => <ParticipanteSessao key={jogador.usuario.id} usuario={jogador.usuario} jogador={jogador} />)}
        </div>
    );
};

function ParticipanteSessao({ usuario, jogador }: { usuario: UsuarioVisualizacaoSimplesDto, jogador: JogadorSessaoDto }) {
    const dadosParticipacao: { tipo: string; nome: string | null; idFicha: number | null } = {
        tipo: jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? 'Personagem' : 'Ficha Temporária',
        nome: jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? jogador.personagemDoJogador.nome : jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.FICHA_TEMPORARIA ? jogador.fichaTemporariaDoJogador.nome : null,
        idFicha: jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? jogador.personagemDoJogador.id : jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.FICHA_TEMPORARIA ? jogador.fichaTemporariaDoJogador.id : null
    };

    return (<div className={styles.recipiente_participante_sessao_modal_sessao}>
        <div className={styles.recipiente_usuario_participante_sessao}>
            <div className={styles.recipiente_dados_usuario_participante_sessao}>
                <h3>{usuario.username}</h3>
                <div className={styles.recipiente_container_avatar_usuario_participante_sessao}>
                    <div className={styles.recipiente_avatar_usuario_participante_sessao}>
                        <AvatarUsuarioEmVisualizacao_CACHED idUsuario={usuario.id} />
                    </div>
                </div>
            </div>
            <div className={styles.recipiente_dados_usuario_inferior_participante_sessao}>
                <div className={styles.recipiente_avatar_personagem_participante_sessao}>
                    <RecipienteImagem src={jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM ? jogador.personagemDoJogador.caminhoAvatar : jogador.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.FICHA_TEMPORARIA ? jogador.fichaTemporariaDoJogador.caminhoAvatar : PathTokenPadrao} />
                </div>
            </div>
        </div>
        <div className={styles.recipiente_dados_participacao}>
            <h2>{dadosParticipacao.tipo}</h2>
            <h3>{dadosParticipacao.nome ?? 'PENDENTE'}</h3>
            {dadosParticipacao.idFicha && (<h4>Ficha ID {dadosParticipacao.idFicha}</h4>)}
        </div>
    </div>
    );
};
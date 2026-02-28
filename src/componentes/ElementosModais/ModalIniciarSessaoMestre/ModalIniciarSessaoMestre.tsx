'use client';

import styles from './styles.module.css';

import { minutosParaMs, SessaoDto } from 'types-nora-api';
import cn from 'classnames';

import { useContextoSessoesMestreEmEspera } from 'Contextos/ContextoSessoesMestreEmEspera/contexto';
import { useContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import RecipienteCapa from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RecipienteCapa/page';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

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
            <Modal.Content cabecalho={{ titulo: 'Mestre: Iniciando Sessão', subtitulo: sessaoSelecionada.tituloInteligente.tituloCompleto }} botaoAcaoPrincipal={{ execucao: () => { executaIniciaSessao(); }, desabilitado: !podeIniciar, texto: 'Iniciar Sessão' }}>
                <ConteudoModal sessao={sessaoSelecionada} diferencaMs={diferencaMs} tempoRestante={tempoRestante} />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal({ sessao, diferencaMs, tempoRestante }: { sessao: SessaoDto; diferencaMs: number; tempoRestante: string; }) {
    return (
        <div className={styles.recipiente_dados_sessao}>
            <RecipienteCapa sessao={sessao} />
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

function DadosParticipantes({ sessao }: { sessao: SessaoDto; }) {
    return (
        <div className={styles.recipiente_participantes_sessao_modal_sessao}>
            <h2>Participantes</h2>
            {sessao.dadosGerais?.participantes.map(participante => (
                <div key={participante.jogador.id} className={styles.recipiente_participante_sessao_modal_sessao}>
                    <div className={styles.recipiente_usuario_participante_sessao}>
                        <div className={styles.recipiente_avatar_usuario_participante_sessao}>
                            <RecipienteImagem src={participante.jogador.customizacao.caminhoAvatar} />
                        </div>
                        <div className={styles.recipiente_dados_usuario_participante_sessao}>
                            <h3>{participante.jogador.username}</h3>
                            <div className={styles.recipiente_dados_usuario_inferior_participante_sessao}>
                                <div className={styles.recipiente_avatar_personagem_participante_sessao}>
                                    {sessao.tipo === 'AVENTURA' ? (
                                        <RecipienteImagem src={participante.dadosParticipanteJogo.personagem?.caminhoAvatar} />
                                    ) : (
                                        <>
                                            {participante.dadosParticipanteJogo.personagem ? (
                                                <RecipienteImagem src={participante.dadosParticipanteJogo.personagem.caminhoAvatar} />
                                            ) : (
                                                <>
                                                    <RecipienteImagem src={'hi/avatar/4fbe625e-8ecc-403f-967e-6041428f4b50.png'} className={cn(!participante.dadosParticipanteJogo.ficha && styles.ficha_nao_configurada)}/>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <p>Personagem: {participanteSessaoUnica.personagem ? participanteSessaoUnica.personagem.informacao.nome : 'Sem Personagem'}</p>
                    <p>Ficha: {participanteSessaoUnica.fichaAmarrada ? `Ficha Temporaria ID ${participanteSessaoUnica.fichaAmarrada.fichaTemporaria.id}` : 'Sem Ficha'}</p> */}
                </div>
            ))}
        </div>
    );
};

function PersonagemOuFichaOuPendenciaDeParticipacaoSessao() {

};
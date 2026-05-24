import styles from './styles.module.css';

import { PericiaCompletaDto, VIEW_JogadorDeSessao } from 'types-nora-api';

import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

interface JanelasNarrador__ParticipantesProps {
    participantesDaSessao: VIEW_JogadorDeSessao[];
    periciasDisponiveis: PericiaCompletaDto[];
    idPericiaSelecionadaParaTeste: number | null;
    idsUsuariosParticipantesSelecionadosParaTeste: number[];
    estaSolicitandoTestePericiaParticipantes: boolean;
    selecionarPericiaParaTesteParticipantes: (idPericia: number | null) => void;
    alternarSelecaoParticipanteParaTestePericia: (idUsuario: number) => void;
    solicitarTestePericiaParticipantesSelecionados: () => void;
};

export default function JanelasNarrador__Participantes({ participantesDaSessao, periciasDisponiveis, idPericiaSelecionadaParaTeste, idsUsuariosParticipantesSelecionadosParaTeste, estaSolicitandoTestePericiaParticipantes, selecionarPericiaParaTesteParticipantes, alternarSelecaoParticipanteParaTestePericia, solicitarTestePericiaParticipantesSelecionados }: JanelasNarrador__ParticipantesProps) {
    const podeSolicitarTeste = idPericiaSelecionadaParaTeste !== null && idsUsuariosParticipantesSelecionadosParaTeste.length > 0 && !estaSolicitandoTestePericiaParticipantes;

    return (
        <div className={styles.recipiente_painel_teste_pericia}>
            <div className={styles.recipiente_controles_teste_pericia}>
                <label className={styles.campo_teste_pericia}>
                    <span>Pericia</span>
                    <select className={styles.seletor_pericia} value={idPericiaSelecionadaParaTeste?.toString() ?? ''} disabled={estaSolicitandoTestePericiaParticipantes} onChange={(event) => selecionarPericiaParaTesteParticipantes(event.target.value ? Number(event.target.value) : null)}>
                        <option value="">Selecionar</option>
                        {periciasDisponiveis.map(pericia => <option key={pericia.id} value={pericia.id}>{pericia.nomeAbreviado} - {pericia.nome}</option>)}
                    </select>
                </label>
                <button className={styles.botao_solicitar_teste} type="button" disabled={!podeSolicitarTeste} onClick={solicitarTestePericiaParticipantesSelecionados}>{estaSolicitandoTestePericiaParticipantes ? 'Executando' : 'Solicitar teste'}</button>
            </div>
            <div className={styles.recipiente_participantes_sala_de_jogo}>
                {participantesDaSessao.map((participante) => <RenderParticipanteSessao key={participante.idUsuario} participante={participante} selecionado={idsUsuariosParticipantesSelecionadosParaTeste.includes(participante.idUsuario)} desabilitado={estaSolicitandoTestePericiaParticipantes} alternarSelecaoParticipanteParaTestePericia={alternarSelecaoParticipanteParaTestePericia} />)}
            </div>
        </div>
    );
};

function RenderParticipanteSessao({ participante, selecionado, desabilitado, alternarSelecaoParticipanteParaTestePericia }: { participante: VIEW_JogadorDeSessao; selecionado: boolean; desabilitado: boolean; alternarSelecaoParticipanteParaTestePericia: (idUsuario: number) => void; }) {
    return (
        <div className={styles.recipiente_conteudo_janela_participantes}>
            <label className={styles.controle_selecao_participante}>
                <input type="checkbox" checked={selecionado} disabled={desabilitado} onChange={() => alternarSelecaoParticipanteParaTestePericia(participante.idUsuario)} />
                <span>{selecionado ? 'Selecionado' : 'Selecionar'}</span>
            </label>
            <div className={styles.recipiente_participante_sala_de_jogo}>
                <h2>{participante.usernameUsuario}</h2>
                <div className={styles.recipiente_avatar_participante_sala_de_jogo}>
                    <RenderArquivoAvatar caminhoArquivoAvatar={participante.avatarAtual} />
                </div>
                <h2>{participante.nomeParticipante}</h2>
            </div>
        </div>
    );
};

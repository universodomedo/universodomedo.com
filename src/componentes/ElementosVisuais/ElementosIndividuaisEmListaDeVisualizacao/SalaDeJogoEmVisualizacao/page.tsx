import styles from './styles.module.css';

import { SalaDeJogo_Mestre, SalaDeJogo_Participante, SalaDeJogo_TipoMestre, SalaDeJogo_TipoParticipante, SalaDeJogoDto } from 'types-nora-api';

import { AvatarUsuarioEmVisualizacao_CACHED } from '../AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function RenderItemSala({ salaDeJogo }: { salaDeJogo: SalaDeJogoDto }) {
    return (
        <div className={styles.recipiente_item_sala}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarTitle}>
                    <span className={styles.toolbarCode}>Sala {salaDeJogo.codigo}</span>
                </div>

                <div className={styles.toolbarRight}>
                    <span className={styles.statusBadge}>{salaDeJogo.tipo}</span>
                    {/* <span className={styles.statusBadge}>{salaDeJogo.estado}</span> */}
                </div>
            </div>

            <div className={styles.body}>
                <RenderMestreSala mestre={salaDeJogo.mestre} />
                <RenderNarradoresSala narradores={salaDeJogo.participantes.filter(participante => participante.tipo === SalaDeJogo_TipoParticipante.SALA__NARRADOR)} />
                <RenderJogadoresSala jogadores={salaDeJogo.participantes.filter(participante => participante.tipo === SalaDeJogo_TipoParticipante.SALA__JOGADOR)} />
            </div>
        </div>
    );
};

function RenderMestreSala({ mestre }: { mestre: SalaDeJogo_Mestre }) {
    if (mestre.tipoMestre === SalaDeJogo_TipoMestre.SALA__INTELIGENTE) return;

    return (
        <div className={styles.section}>
            <p className={styles.section_title}>Mestre</p>
            <div className={styles.chipRow}>
                <div className={styles.recipiente_imagem_avatar}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={mestre.idUsuario} /></div>
            </div>
        </div>
    );
};

function RenderNarradoresSala({ narradores }: { narradores: SalaDeJogo_Participante[] }) {
    return (
        <div className={styles.section}>
            <p className={styles.section_title}>Narradores</p>
            <div className={styles.chipRow}>
                {narradores.map(narrador => <div key={narrador.idUsuario} className={styles.recipiente_imagem_avatar}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={narrador.idUsuario} /></div>)}
            </div>
        </div>
    );
};

function RenderJogadoresSala({ jogadores }: { jogadores: SalaDeJogo_Participante[] }) {
    return (
        <div className={styles.section}>
            <p className={styles.section_title}>Jogadores</p>
            <div className={styles.chipRow}>
                {/* {jogadores.filter(jogador => jogador.tipo === SalaDeJogo_TipoParticipante.SALA__JOGADOR).map(jogador => <div key={jogador.idUsuario} className={styles.recipiente_imagem_avatar}><RecipienteImagem src={jogador.personagem.caminhoAvatar} /></div>)} */}
            </div>
        </div>
    );
};
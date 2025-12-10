import styles from './styles.module.css';

import { SalaDeJogo_Mestre, SalaDeJogo_Participante, SalaDeJogo_TipoMestre, SalaDeJogo_TipoParticipante, SOCKET_SalaDeJogoDto } from 'types-nora-api';

import { AvatarUsuarioEmVisualizacao_CACHED } from '../AvatarUsuarioEmVisualizacao/page';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function RenderItemSala({ salaDeJogo }: { salaDeJogo: SOCKET_SalaDeJogoDto }) {
    return (
        <div className={styles.recipiente_item_sala}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarTitle}>
                    <span className={styles.toolbarCode}>Sala {salaDeJogo.codigoSala}</span>
                </div>

                <div className={styles.toolbarRight}>
                    <span className={styles.statusBadge}>{salaDeJogo.tipo}</span>
                    <span className={styles.statusBadge}>{salaDeJogo.estado}</span>
                </div>
            </div>

            <div className={styles.body}>
                <RenderMestreSala mestre={salaDeJogo.mestreSala} />
                <RenderNarradoresSala narradores={salaDeJogo.participantesSala.filter(participante => participante.tipo === SalaDeJogo_TipoParticipante.SALA__NARRADOR)} />
                <RenderJogadoresSala jogadores={salaDeJogo.participantesSala.filter(participante => participante.tipo === SalaDeJogo_TipoParticipante.SALA__JOGADOR)} />
            </div>
        </div>
    );
};

function RenderMestreSala({ mestre }: { mestre: SalaDeJogo_Mestre }) {
    if (mestre.tipoMestre === SalaDeJogo_TipoMestre.SALA__INTELIGENTE) return;

    return (
        <div className={styles.section}>
            <p className={styles.sectionTitle}>Mestre</p>
            <div className={styles.chipRow}>
                <div className={styles.recipiente_imagem_avatar}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={mestre.idUsuario} /></div>
            </div>
        </div>
    );
};

function RenderNarradoresSala({ narradores }: { narradores: SalaDeJogo_Participante[] }) {
    return (
        <div className={styles.section}>
            <p className={styles.sectionTitle}>Narradores</p>
            <div className={styles.chipRow}>
                {narradores.map(narrador => <div key={narrador.idUsuario} className={styles.recipiente_imagem_avatar}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={narrador.idUsuario} /></div>)}
            </div>
        </div>
    );
};

function RenderJogadoresSala({ jogadores }: { jogadores: SalaDeJogo_Participante[] }) {
    return (
        <div className={styles.section}>
            <p className={styles.sectionTitle}>Jogadores</p>
            <div className={styles.chipRow}>
                {/* {jogadores.map(jogador => <div key={jogador.idUsuario} className={styles.recipiente_imagem_avatar}><RecipienteImagem src={jogador.personagens[0].caminhoAvatar} /></div>)} */}
            </div>
        </div>
    );
};
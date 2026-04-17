import styles from './styles.module.css';

import { AvataresPertencentesDto } from 'types-nora-api';

import { useContextoGerenciarAvatares__Personagem } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function SPA__PaginaGerenciarAvatares__Personagem() {
    const { personagem, abreModalUploadEVerificacaoAvatar } = useContextoGerenciarAvatares__Personagem();

    return (
        <div className={styles.recipiente_gerenciamento_avatares_do_personagem}>
            <button onClick={abreModalUploadEVerificacaoAvatar}>Adicionar novo Avatar</button>
            <div className={styles.recipiente_avatares_do_personagem}>
                <AvataresPersonagem avataresPersonagem={personagem.avatares} />
            </div>
        </div>
    );
};

function AvataresPersonagem({ avataresPersonagem }: { avataresPersonagem: AvataresPertencentesDto }) {
    if (avataresPersonagem.caminhosAvatares.length < 1) return <h2>Esse Personagem não tem avatares</h2>;

    return (
        <>
            {avataresPersonagem.caminhosAvatares.map((caminhoAvatar, index) => <AvatarPersonagem key={index} avatarPersonagem={caminhoAvatar} />)}
        </>
    );
};

function AvatarPersonagem({ avatarPersonagem }: { avatarPersonagem: string }) {
    return (
        <div className={styles.recipiente_avatar}>
            <RecipienteImagem src={avatarPersonagem} />
        </div>
    );
};
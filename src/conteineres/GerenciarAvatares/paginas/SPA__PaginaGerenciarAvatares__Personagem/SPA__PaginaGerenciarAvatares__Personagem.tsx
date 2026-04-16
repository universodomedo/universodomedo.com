import styles from './styles.module.css';

import { AvataresPertencentesDto } from 'types-nora-api';

import { useContextoGerenciarAvatares__Personagem } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import RecipienteAdicionarAvatarDePersonagem from 'Contextos/Contexto__PaginaArtista_AdicionarAvatarDePersonagem/contexto';

export default function SPA__PaginaGerenciarAvatares__Personagem() {
    const { personagem } = useContextoGerenciarAvatares__Personagem();

    return (
        <div className={styles.recipiente_gerenciamento_avatares_do_personagem}>
            <RecipienteAdicionarAvatarDePersonagem idPersonagem={personagem.id} />
            <div className={styles.recipiente_avatares_do_personagem}>
                <AvataresPersonagem avataresPersonagem={personagem.avatares} />
            </div>
        </div>
    );
};

function AvataresPersonagem({ avataresPersonagem }: { avataresPersonagem: AvataresPertencentesDto }) {
    if (avataresPersonagem.caminhosAvatares.length < 1) return <h2>Esse Personagem não tem avatares</h2>;

    return (
        <div className={styles.recipiente_itens_avatares}>
            {avataresPersonagem.caminhosAvatares.map(avatar => avatar)}
        </div>
    );
};
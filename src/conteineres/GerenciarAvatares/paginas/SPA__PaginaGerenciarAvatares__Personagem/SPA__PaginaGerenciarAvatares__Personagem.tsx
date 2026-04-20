import styles from './styles.module.css';

import { AvatarPersonagemDto, PathTokenPadrao } from 'types-nora-api';

import { useContextoGerenciarAvatares__Personagem } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { DivClicavel } from '@/componentes/Elementos/DivClicavel/DivClicavel';
import { formataData } from '@/uteis/FormatadorDeDatas/FormatadorDeDatas';

export default function SPA__PaginaGerenciarAvatares__Personagem() {
    const { personagem } = useContextoGerenciarAvatares__Personagem();

    return (
        <div className={styles.recipiente_gerenciamento_avatares_do_personagem}>
            <div className={styles.recipiente_avatares_do_personagem}>
                {personagem.avatares.length < 1 ? (
                    <h2>Nenhuma Chave de Avatar configurada para esse Personagem</h2>
                ) : (
                    <>
                        {personagem.avatares.map(avatar => <VisualizarChaveDeAvatarDoPersonagem key={avatar.idChaveNovoAvatar} avatar={avatar} />)}
                    </>
                )}
            </div>
        </div>
    );
};

function VisualizarChaveDeAvatarDoPersonagem({ avatar }: { avatar: AvatarPersonagemDto }) {
    const { selecionarChaveAvatarConfigurando } = useContextoGerenciarAvatares__Personagem();

    return (
        <DivClicavel className={styles.recipiente_chave_avatar} onClick={() => selecionarChaveAvatarConfigurando(avatar.idChaveNovoAvatar)} desabilitado={avatar.avatarEstaConfigurado} classeParaDesabilitado={styles.avatar_ja_configurado}>
            <div className={styles.recipiente_avatar}>
                <RecipienteImagem src={avatar.caminhoArquivo ?? PathTokenPadrao} />
            </div>

            {avatar.dataMomentoCanonico && <h4>{formataData(avatar.dataMomentoCanonico)}</h4>}
            <h5>{avatar.descricao}</h5>
        </DivClicavel>
    );
};
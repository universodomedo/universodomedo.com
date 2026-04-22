import styles from './styles.module.css';

import { pluralize, VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';
import cn from 'classnames';

import { useContextoGerenciarAvatares__Listagem } from 'Contextos/ContextoGerenciarAvatares__Listagem/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function SPA__PaginaGerenciarAvatares__Listagem() {
    const { personagens } = useContextoGerenciarAvatares__Listagem();

    return (
        <div className={styles.recipiente_listagem_personagens_e_seus_avatares}>
            {personagens.map(personagem => <RegistroPersonagemESeusAvatares key={personagem.id} personagem={personagem} />)}
        </div>
    );
};

function RegistroPersonagemESeusAvatares({ personagem }: { personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto }) {
    const { selecionaPersonagem } = useContextoGerenciarAvatares__Listagem();

    const numeroTotalDeAvatares = personagem.avatares.length;

    if (numeroTotalDeAvatares < 1) return (
        <div className={cn(styles.recipiente_registro_personagem_e_seus_avatares, styles.sem_avatares)}>
            <div className={styles.recipiente_imagem_avatar}>
                <RenderArquivoAvatar caminhoArquivoAvatar={personagem.avatarAtual} />
            </div>

            <h4>{personagem.nome}</h4>
        </div>
    );

    const numeroDeAvataresConfigurados = personagem.avatares.filter(avatar => avatar.avatarEstaConfigurado).length;
    
    return (
        <DivClicavel className={styles.recipiente_registro_personagem_e_seus_avatares} onClick={() => selecionaPersonagem(personagem.id)} desabilitado={personagem.avatares.length < 1} classeParaDesabilitado={styles.sem_avatares}>
            <div className={styles.recipiente_imagem_avatar}>
                <RenderArquivoAvatar caminhoArquivoAvatar={personagem.avatarAtual} />
            </div>

            <h4>{personagem.nome}</h4>
            <h5 className={numeroTotalDeAvatares > numeroDeAvataresConfigurados ? styles.pendente : styles.completo}>{`${numeroDeAvataresConfigurados}/${numeroTotalDeAvatares} ${pluralize(numeroTotalDeAvatares, 'avatar', 'avatares')}`}</h5>
        </DivClicavel>
    );
};
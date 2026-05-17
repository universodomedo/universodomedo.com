import styles from './styles.module.css';

import { pluralize } from 'types-nora-api';
import cn from 'classnames';

import { useContextoGerenciarAvatares__Listagem } from 'Contextos/ContextoGerenciarAvatares__Listagem/contexto';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type PersonagemGerenciarAvatares = ReturnType<typeof useContextoGerenciarAvatares__Listagem>['listagemPersonagens']['registros'][number];

export default function SPA__PaginaGerenciarAvatares__Listagem() {
    const { listagemPersonagens } = useContextoGerenciarAvatares__Listagem();

    return (
        <ListagemComposta
            listagem={listagemPersonagens}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={6}
            obterIdRegistro={personagem => personagem.id}
            renderizarItem={personagem => <RegistroPersonagemESeusAvatares key={personagem.id} personagem={personagem} />}
        />
    );
};

function RegistroPersonagemESeusAvatares({ personagem }: { personagem: PersonagemGerenciarAvatares; }) {
    const { selecionaPersonagem } = useContextoGerenciarAvatares__Listagem();

    const numeroTotalDeAvatares = personagem.avatares.avataresOrdenados.length;

    if (numeroTotalDeAvatares < 1) return (
        <div className={cn(styles.recipiente_registro_personagem_e_seus_avatares, styles.sem_avatares)}>
            <div className={styles.recipiente_imagem_avatar}>
                <RenderArquivoAvatar caminhoArquivoAvatar={personagem.avatares.avatarAtual} />
            </div>

            <h4>{personagem.nome}</h4>
        </div>
    );

    const numeroDeAvataresConfigurados = personagem.avatares.avataresOrdenados.filter(avatar => avatar.avatarEstaConfigurado).length;
    
    return (
        <DivClicavel className={styles.recipiente_registro_personagem_e_seus_avatares} onClick={() => selecionaPersonagem(personagem.id)} desabilitado={personagem.avatares.avataresOrdenados.length < 1} classeParaDesabilitado={styles.sem_avatares}>
            <div className={styles.recipiente_imagem_avatar}>
                <RenderArquivoAvatar caminhoArquivoAvatar={personagem.avatares.avatarAtual} />
            </div>

            <h4>{personagem.nome}</h4>
            <h5 className={numeroTotalDeAvatares > numeroDeAvataresConfigurados ? styles.pendente : styles.completo}>{`${numeroDeAvataresConfigurados}/${numeroTotalDeAvatares} ${pluralize(numeroTotalDeAvatares, 'avatar', 'avatares')}`}</h5>
        </DivClicavel>
    );
};
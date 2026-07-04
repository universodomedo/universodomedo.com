import styles from './styles.module.css';

import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes/contexto';
import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';
import SPA__PaginaGameDesignerConfiguracaoPartida__Visao from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Visao/SPA__PaginaGameDesignerConfiguracaoPartida__Visao';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Edicao() {
    const { partida, aba, setAba, carregando, erro, configuracaoInicial, salvando, salvarConfiguracao, idMusicaConfigurada, definirMusicaConfigurada, idMusicaEmJogo, definirMusicaEmJogo } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();

    // Landing = Dados de Exibição (só leitura). Entrar num editor troca a aba; o "voltar" é o X contextual do cabeçalho (fecharProps), não uma barra própria.
    if (aba === 'visao') return <SPA__PaginaGameDesignerConfiguracaoPartida__Visao />;

    return (
        <div className={styles.painel}>
            {aba === 'runtime' && (carregando ? <p className={styles.estado}>{carregando}…</p> : erro ? <p className={styles.estado}>{erro}</p> : <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider partida={partida} configuracaoInicial={configuracaoInicial} salvando={salvando} salvar={salvarConfiguracao} />)}
            {aba === 'arteCapa' && <Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider partida={partida} />}
            {aba === 'musica' && <Componente_Selecionador__MusicaDeFundo idInicial={idMusicaConfigurada} aoConfirmar={async idMusica => { await definirMusicaConfigurada(idMusica); setAba('visao'); }} />}
            {aba === 'musicaEmJogo' && <Componente_Selecionador__MusicaDeFundo idInicial={idMusicaEmJogo} aoConfirmar={async idMusica => { await definirMusicaEmJogo(idMusica); setAba('visao'); }} />}
        </div>
    );
};

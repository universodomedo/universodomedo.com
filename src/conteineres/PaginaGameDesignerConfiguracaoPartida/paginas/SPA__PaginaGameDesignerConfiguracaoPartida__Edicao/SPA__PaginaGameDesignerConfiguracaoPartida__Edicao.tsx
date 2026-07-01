import styles from './styles.module.css';

import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes/contexto';
import { SecaoMusicaFundo } from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes/SecaoMusicaFundo';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Edicao() {
    const { partida, aba, setAba, carregando, erro, configuracaoInicial, salvando, salvarConfiguracao } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();

    return (
        <div className={styles.host}>
            <div className={styles.abas} role="tablist">
                <button type="button" role="tab" aria-selected={aba === 'runtime'} className={aba === 'runtime' ? styles.aba_ativa : styles.aba} onClick={() => setAba('runtime')}>Runtime</button>
                <button type="button" role="tab" aria-selected={aba === 'arteCapa'} className={aba === 'arteCapa' ? styles.aba_ativa : styles.aba} onClick={() => setAba('arteCapa')}>Arte de Capa</button>
                <button type="button" role="tab" aria-selected={aba === 'musica'} className={aba === 'musica' ? styles.aba_ativa : styles.aba} onClick={() => setAba('musica')}>Música de Fundo</button>
            </div>

            <div className={aba === 'runtime' ? styles.painel : styles.painel_oculto}>
                {carregando ? <p className={styles.estado}>{carregando}…</p> : erro ? <p className={styles.estado}>{erro}</p> : <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider partida={partida} configuracaoInicial={configuracaoInicial} salvando={salvando} salvar={salvarConfiguracao} />}
            </div>

            <div className={aba === 'arteCapa' ? styles.painel : styles.painel_oculto}>
                <Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider partida={partida} />
            </div>

            <div className={aba === 'musica' ? styles.painel : styles.painel_oculto}>
                <SecaoMusicaFundo idPartida={partida.id} idMusicaInicial={partida.idMusicaConfigurada} />
            </div>
        </div>
    );
};

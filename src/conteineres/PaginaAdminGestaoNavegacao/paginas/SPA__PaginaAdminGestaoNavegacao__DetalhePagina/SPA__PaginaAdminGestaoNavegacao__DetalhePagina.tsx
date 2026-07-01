'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { PreviewMusicaConfigurada } from './PreviewMusicaConfigurada';
import { useContexto__PaginaAdminGestaoNavegacao__DetalhePagina } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__DetalhePagina/contexto';

export default function SPA__PaginaAdminGestaoNavegacao__DetalhePagina() {
    const { idMusicaAtual, ativoAtual, iniciarEdicao, salvarMusica, definirAtivo } = useContexto__PaginaAdminGestaoNavegacao__DetalhePagina();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.host}>
                    <div className={styles.grade}>
                        <section className={styles.cartao}>
                            <header className={styles.cabecalho}>
                                <h3 className={styles.titulo}>Música de Fundo</h3>
                                <button type="button" className={styles.botao_editar} onClick={iniciarEdicao}>{idMusicaAtual === null ? 'Definir' : 'Editar'}</button>
                            </header>
                            <PreviewMusicaConfigurada idMusica={idMusicaAtual} />
                        </section>
                    </div>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                {idMusicaAtual !== null && <button type="button" data-variante="perigo" onClick={() => salvarMusica(null)}>Limpar Música</button>}
                {ativoAtual
                    ? <button type="button" data-variante="perigo" onClick={() => definirAtivo(false)}>Inativar Página</button>
                    : <button type="button" data-variante="secundario" onClick={() => definirAtivo(true)}>Ativar Página</button>}
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
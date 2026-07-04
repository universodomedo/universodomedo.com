'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { PreviewMusicaConfigurada } from './PreviewMusicaConfigurada';
import { useContexto__PaginaAdminGestaoNavegacao__DetalhePagina } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__DetalhePagina/contexto';

export default function SPA__PaginaAdminGestaoNavegacao__DetalhePagina() {
    const { idMusicaAtual, ativoAtual, iniciarEdicao, salvarMusica, definirAtivo, menusDisponiveis, menuInternoTipo, menuInternoFkMenusId, salvandoMenuInterno, definirMenuInterno } = useContexto__PaginaAdminGestaoNavegacao__DetalhePagina();

    const valorMenuInterno = menuInternoTipo === 'menu' && menuInternoFkMenusId !== null ? `menu:${menuInternoFkMenusId}` : menuInternoTipo;
    const aoMudarMenuInterno = (valor: string) => {
        if (valor === 'vazio') definirMenuInterno('vazio', null);
        else if (valor === 'dinamico') definirMenuInterno('dinamico', null);
        else definirMenuInterno('menu', Number(valor.slice('menu:'.length)));
    };

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
                        <section className={styles.cartao}>
                            <header className={styles.cabecalho}>
                                <h3 className={styles.titulo}>Menu interno</h3>
                            </header>
                            {menusDisponiveis === null
                                ? <p className={styles.carregando_menu}>Carregando menus…</p>
                                : (
                                    <select className={styles.select_menu} value={valorMenuInterno} disabled={salvandoMenuInterno} onChange={e => aoMudarMenuInterno(e.target.value)}>
                                        <option value="vazio">Nenhum (sem menu lateral)</option>
                                        <option value="dinamico">Dinâmico (calculado em runtime)</option>
                                        {menusDisponiveis.map(menu => <option key={menu.id} value={`menu:${menu.id}`}>{menu.chave}</option>)}
                                    </select>
                                )}
                            <p className={styles.dica_menu}>Qual menu lateral esta página exibe.</p>
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
'use client';

import styles from './styles.module.css';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import CorpoAssistindoGrupoAventura from 'Componentes/ElementosAssistirAventura/CorpoAssistindoGrupoAventura/page';
import { IconeAcaoVoltarPaginaAventuras, IconeAcaoBuscarSessaoAnterior, IconeAcaoBuscarSessaoSeguinte } from 'Componentes/ElementosAssistirAventura/IconesAcoes/componentes';

export function PaginaAventura_Slot() {
    const { grupoAventuraSelecionado, sessaoSelecionada, buscaSessao, limpaSessao } = useContextoPaginaAventura();

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_pagina_assistir_aventura}>
            <div id={styles.recipiente_corpo_pagina_assistir_aventura}>
                <div id={styles.recipiente_corpo_conteudo_episodio}>
                    <div id={styles.recipiente_imagem_capa_aventura_de_fundo}>
                        <RecipienteImagem src={grupoAventuraSelecionado.imagemCapa?.fullPath} />
                        <IconeAcaoVoltarPaginaAventuras />
                        <IconeAcaoBuscarSessaoAnterior />
                        <IconeAcaoBuscarSessaoSeguinte />
                    </div>
                    <div id={styles.recipiente_foreground}>
                        <CorpoAssistindoGrupoAventura />
                    </div>
                </div>
                <div id={styles.recipiente_menu_lateral_episodios} {...scrollableProps}>
                    <DivClicavel key={0} className={styles.recipiente_linha_episodio} classeParaDesabilitado={styles.ativo} desabilitado={!sessaoSelecionada} onClick={() => limpaSessao()}>
                        <h2>Início</h2>
                    </DivClicavel>
                    <hr style={{ margin: '1vh 0 .4vh' }} />
                    {grupoAventuraSelecionado.gruposAventura![0].sessoes.sort((a, b) => a.id - b.id).map(sessao => (
                        <DivClicavel key={sessao.id} className={styles.recipiente_linha_episodio} classeParaDesabilitado={styles.ativo} desabilitado={sessaoSelecionada?.id === sessao.id} onClick={() => buscaSessao(sessao.id)}>
                            <h2>{sessao.episodioPorExtenso}</h2>
                        </DivClicavel>
                    ))}
                </div>
            </div>
        </div>
    );
};
'use client';

import styles from './styles.module.css';
import { useEffect } from 'react';

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import { IconeAcaoBuscarSessaoAnterior, IconeAcaoBuscarSessaoSeguinte } from 'Componentes/ElementosAssistirAventura/IconesAcoes/componentes';
import CorpoAssistindoGrupoAventura from 'Componentes/ElementosAssistirAventura/CorpoAssistindoGrupoAventura/page';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export function PaginaAventura_Conteudo() {
    const { grupoAventuraSelecionado, alteraSessaoManualmente, podeAlterarSessaoManualmente } = useContextoPaginaAventura();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && podeAlterarSessaoManualmente.podeBuscarAnterior) {
                alteraSessaoManualmente('anterior');
            }
            if (e.key === 'ArrowRight' && podeAlterarSessaoManualmente.podeBuscarSeguinte) {
                alteraSessaoManualmente('seguinte');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [alteraSessaoManualmente, podeAlterarSessaoManualmente]);

    return (
        <div id={styles.recipiente_corpo_conteudo_episodio}>
            <div id={styles.recipiente_imagem_capa_aventura_de_fundo}>
                <RecipienteImagem src={grupoAventuraSelecionado.aventura.imagemCapa?.fullPath} />
                <IconeAcaoBuscarSessaoAnterior />
                <IconeAcaoBuscarSessaoSeguinte />
            </div>
            <div id={styles.recipiente_foreground}>
                <CorpoAssistindoGrupoAventura />
            </div>
        </div>
    );
};

export function PaginaAventura_Menu() {
    const { grupoAventuraSelecionado, detalheSessaoSelecionada, buscaSessao, limpaSessao } = useContextoPaginaAventura();

    return (
        <div id={styles.recipiente_menu_aventura}>
            <DivClicavel key={0} className={styles.recipiente_linha_episodio} classeParaDesabilitado={styles.ativo} desabilitado={!detalheSessaoSelecionada} onClick={() => limpaSessao()}>
                <h2>Início</h2>
            </DivClicavel>
            <hr style={{ margin: '1vh 0 .4vh' }} />
            {grupoAventuraSelecionado.detalhesSessoesCanonicas.sort((a, b) => a.episodio - b.episodio).map(detalheSessaoesCanonicas => (
                <DivClicavel key={detalheSessaoesCanonicas.sessao.id} className={styles.recipiente_linha_episodio} classeParaDesabilitado={styles.ativo} desabilitado={detalheSessaoSelecionada?.sessao.id === detalheSessaoesCanonicas.sessao.id} onClick={() => buscaSessao(detalheSessaoesCanonicas.sessao.id)}>
                    <h2>{detalheSessaoesCanonicas.episodioPorExtenso}</h2>
                </DivClicavel>
            ))}
        </div>
    );
};
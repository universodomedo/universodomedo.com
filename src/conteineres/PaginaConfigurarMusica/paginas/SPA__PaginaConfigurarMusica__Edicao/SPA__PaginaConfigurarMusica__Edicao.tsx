'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { useContexto__PaginaConfigurarMusica__Edicao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';
import EditorTimelineMusica from './componentes/EditorTimelineMusica/EditorTimelineMusica';
import PainelBlocoSelecionado from './componentes/PainelBlocoSelecionado/PainelBlocoSelecionado';
import PainelTransicaoLoop from './componentes/PainelTransicaoLoop/PainelTransicaoLoop';

export default function SPA__PaginaConfigurarMusica__Edicao() {
    const ctx = useContexto__PaginaConfigurarMusica__Edicao();

    return (
        <section className={styles.editor}>
            {ctx.erroAudio ? (
                <div className={styles.aviso}>{ctx.erroAudio}</div>
            ) : !ctx.montagemPronta ? (
                <div className={styles.aviso}>Carregando forma de onda…</div>
            ) : (
                <div className={styles.corpo}>
                    <EditorTimelineMusica
                        picos={ctx.picos} duracaoMs={ctx.duracaoMs} inicioMs={ctx.inicioMs} retornoMs={ctx.retornoMs} fimMs={ctx.fimMs} blocos={ctx.blocos} transicaoLoop={ctx.transicaoLoop} posicaoMs={ctx.posicaoMs} tocando={ctx.tocando} podeTocar={!ctx.carregandoAudio} blocoSelecionadoId={ctx.blocoSelecionadoId}
                        onSelecionarBloco={ctx.selecionarBloco} onArrastarInicio={ctx.setInicioMs} onArrastarRetorno={ctx.setRetornoMs} onArrastarFim={ctx.setFimMs} onMoverFronteira={ctx.moverFronteira} onDividirEm={ctx.dividirEm} onIrPara={ctx.irParaMs}
                        onPlayPause={ctx.alternarPlayPause} onParar={ctx.parar} onInicio={ctx.tocarDoInicio} onTestarLoop={ctx.testarLoop}
                        onMarcarInicio={ctx.marcarInicio} onMarcarRetorno={ctx.marcarRetorno} onMarcarFim={ctx.marcarFim} onCortar={ctx.cortarNaPosicao}
                    />

                    <div className={styles.paineis}>
                        <PainelBlocoSelecionado bloco={ctx.blocoSelecionado} podeRemover={ctx.blocos.length > 1} onRenomear={nome => ctx.blocoSelecionado && ctx.renomearBloco(ctx.blocoSelecionado.id, nome)} onTestar={() => ctx.blocoSelecionado && ctx.tocarBloco(ctx.blocoSelecionado.id)} onRemover={() => ctx.blocoSelecionado && ctx.removerBloco(ctx.blocoSelecionado.id)} />
                        <PainelTransicaoLoop transicaoLoop={ctx.transicaoLoop} onSetCampo={ctx.setCampoTransicaoLoop} onTestar={ctx.testarLoop} />
                    </div>
                </div>
            )}

            <footer className={styles.rodape}>
                {ctx.erroSalvar ? <span className={styles.erro}>{ctx.erroSalvar}</span> : null}
                <button className={styles.botaoSalvar} disabled={!ctx.podeSalvar} onClick={ctx.salvar}>
                    <FontAwesomeIcon icon={faFloppyDisk} /> {ctx.salvando ? 'Salvando...' : ctx.configurada ? 'Salvar alterações' : 'Salvar configuração'}
                </button>
            </footer>
        </section>
    );
};

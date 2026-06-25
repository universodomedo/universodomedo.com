'use client';

import styles from '../styles.module.css';

import { useContexto__PaginaConfigurarMusica__Edicao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';
import EditorTimelineMusica from '../componentes/EditorTimelineMusica/EditorTimelineMusica';
import PainelBlocoSelecionado from '../componentes/PainelBlocoSelecionado/PainelBlocoSelecionado';
import PainelTransicaoLoop from '../componentes/PainelTransicaoLoop/PainelTransicaoLoop';

export default function AbaMontagem() {
    const ctx = useContexto__PaginaConfigurarMusica__Edicao();

    if (ctx.erroAudio) return <div className={styles.aviso}>{ctx.erroAudio}</div>;
    if (!ctx.montagemPronta) return <div className={styles.aviso}>Carregando forma de onda…</div>;

    return (
        <div className={styles.corpo}>
            <EditorTimelineMusica
                picos={ctx.picos} duracaoMs={ctx.duracaoMs} inicioMs={ctx.inicioMs} retornoMs={ctx.retornoMs} fimMs={ctx.fimMs} blocos={ctx.blocos} transicaoLoop={ctx.transicaoLoop} posicaoMs={ctx.posicaoMs} tocando={ctx.tocando} podeTocar={!ctx.carregandoAudio} blocoSelecionadoId={ctx.blocoSelecionadoId}
                onSelecionarBloco={ctx.selecionarBloco} onArrastarInicio={ctx.setInicioMs} onArrastarRetorno={ctx.setRetornoMs} onArrastarFim={ctx.setFimMs} onMoverFronteira={ctx.moverFronteira} onDividirEm={ctx.dividirEm} onIrPara={ctx.irParaMs}
                onPlayPause={ctx.alternarPlayPause} onParar={ctx.parar} onInicio={ctx.tocarDoInicio} onTestarLoop={ctx.testarLoop} onRepetirEmenda={ctx.repetirEmenda}
                onMarcarInicio={ctx.marcarInicio} onMarcarRetorno={ctx.marcarRetorno} onMarcarFim={ctx.marcarFim} onCortar={ctx.cortarNaPosicao}
            />

            <div className={styles.paineis}>
                <PainelBlocoSelecionado bloco={ctx.blocoSelecionado} podeRemover={ctx.blocos.length > 1} onRenomear={nome => ctx.blocoSelecionado && ctx.renomearBloco(ctx.blocoSelecionado.id, nome)} onTestar={() => ctx.blocoSelecionado && ctx.tocarBloco(ctx.blocoSelecionado.id)} onRemover={() => ctx.blocoSelecionado && ctx.removerBloco(ctx.blocoSelecionado.id)} />
                <PainelTransicaoLoop transicaoLoop={ctx.transicaoLoop} onSetCampo={ctx.setCampoTransicaoLoop} onTestar={ctx.testarLoop} onRepetirEmenda={ctx.repetirEmenda} />
            </div>
        </div>
    );
};

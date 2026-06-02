import styles from './MapaFuncionalRecursos.module.css';
import chipStyles from './MapaFuncionalRecursosChips.module.css';
import posicoesStyles from './MapaFuncionalRecursosPosicoes.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import { useContextoPaginaControleRecursos } from './ContextoPaginaControleRecursos';
import MapaFuncionalRecursosLegenda from './MapaFuncionalRecursosLegenda';

export default function MapaFuncionalRecursos({ recursos }: { recursos: RecursoFichaEmJogo[]; }) {
    const recursosOrdenados = ordenaRecursosPorSlotVisual(recursos);

    if (recursosOrdenados.length === 0) return null;

    return (
        <section className={styles.mapa_funcional_recursos} aria-label="Mapa corporal dos recursos">
            <h3 className={styles.titulo_mapa_funcional}>Corpo</h3>
            <div className={styles.painel_mapa_corporal}>
                {recursosOrdenados.map(recurso => <RecursoMapaFuncional key={recurso.key} recurso={recurso} />)}
            </div>
            <MapaFuncionalRecursosLegenda />
        </section>
    );
};

function RecursoMapaFuncional({ recurso }: { recurso: RecursoFichaEmJogo; }) {
    const { keyRecursoSelecionado, selecionaRecurso } = useContextoPaginaControleRecursos();
    const recursoSelecionado = keyRecursoSelecionado === recurso.key;

    return (
        <button type="button" className={`${chipStyles.recurso_mapa_funcional} ${obtemClasseEstadoRecurso(recurso.estadoResumo.tipo)} ${obtemClassePosicaoMapa(recurso.slotVisualFuncional.posicaoMapa)} ${recursoSelecionado ? chipStyles.recurso_mapa_selecionado : ''}`} aria-label={`${recurso.slotVisualFuncional.nome} - ${recurso.estadoResumo.nome}`} onClick={() => selecionaRecurso(recurso.key)} aria-pressed={recursoSelecionado}>
            <span className={chipStyles.icone_recurso_mapa} aria-hidden={true}>{recurso.slotVisualFuncional.iconeTexto}</span>
            <strong className={chipStyles.nome_recurso_mapa}>{recurso.slotVisualFuncional.nome}</strong>
            <span className={chipStyles.estado_recurso_mapa}>{recurso.estadoResumo.nome}</span>
        </button>
    );
};

function ordenaRecursosPorSlotVisual(recursos: RecursoFichaEmJogo[]): RecursoFichaEmJogo[] {
    return [...recursos].sort((recursoA, recursoB) => {
        const ordem = recursoA.slotVisualFuncional.ordem - recursoB.slotVisualFuncional.ordem;
        if (ordem !== 0) return ordem;
        return recursoA.slotVisualFuncional.nome.localeCompare(recursoB.slotVisualFuncional.nome);
    });
};

function obtemClasseEstadoRecurso(tipoEstado: RecursoFichaEmJogo['estadoResumo']['tipo']): string {
    if (tipoEstado === 'livre') return chipStyles.recurso_livre;
    if (tipoEstado === 'indisponivel') return chipStyles.recurso_indisponivel;
    return chipStyles.recurso_ocupado;
};

function obtemClassePosicaoMapa(posicaoMapa: RecursoFichaEmJogo['slotVisualFuncional']['posicaoMapa']): string {
    if (posicaoMapa === 'centro_topo') return posicoesStyles.centro_topo;
    if (posicaoMapa === 'centro_alto') return posicoesStyles.centro_alto;
    if (posicaoMapa === 'centro_meio') return posicoesStyles.centro_meio;
    if (posicaoMapa === 'centro_baixo') return posicoesStyles.centro_baixo;
    if (posicaoMapa === 'esquerda_alto') return posicoesStyles.esquerda_alto;
    if (posicaoMapa === 'direita_alto') return posicoesStyles.direita_alto;
    if (posicaoMapa === 'esquerda_meio') return posicoesStyles.esquerda_meio;
    if (posicaoMapa === 'direita_meio') return posicoesStyles.direita_meio;
    if (posicaoMapa === 'esquerda_baixo') return posicoesStyles.esquerda_baixo;
    return posicoesStyles.direita_baixo;
};

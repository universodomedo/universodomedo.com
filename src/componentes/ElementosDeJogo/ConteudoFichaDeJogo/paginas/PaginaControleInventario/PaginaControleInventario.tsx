import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import type { AcaoTemporalSalaDeJogoRuntime, EstadoItemInventarioSalaDeJogoRuntime, ItemInventarioSalaJogoWsDto } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoControleAcoesRuntime } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';
import { useContextoTelaDeJogoMapaLogicoOpcional } from 'Componentes/ElementosDeJogo/TelaDeJogo/ContextoTelaDeJogoMapaLogico';

const ROTULOS_ESTADO_ITEM: Record<EstadoItemInventarioSalaDeJogoRuntime, string> = { GUARDADO: 'Guardado', SACANDO: 'Sacando', EMPUNHADO: 'Empunhado' };

export default function PaginaControleInventario() {
    const { desativarAcoes } = useContextoFichaDePersonagem();
    const { executaSaqueItem, estadoTemporalSalaJogo } = useContextoControleAcoesRuntime();
    const mapaLogico = useContextoTelaDeJogoMapaLogicoOpcional();
    const [momentoProjetadoMs, setMomentoProjetadoMs] = useState(0);

    useEffect(() => {
        if (!estadoTemporalSalaJogo) return;
        const momentoReferenciaMs = estadoTemporalSalaJogo.momentoAtualMs;
        const recebidoLocalmenteEmMs = Date.now();
        setMomentoProjetadoMs(momentoReferenciaMs);

        if (estadoTemporalSalaJogo.status !== 'RODANDO') return;

        const intervalo = window.setInterval(() => {
            const projetado = momentoReferenciaMs + Math.max(0, Date.now() - recebidoLocalmenteEmMs);
            setMomentoProjetadoMs(estadoTemporalSalaJogo.momentoLimiteProjecaoMs === null ? projetado : Math.min(projetado, estadoTemporalSalaJogo.momentoLimiteProjecaoMs));
        }, 100);

        return () => window.clearInterval(intervalo);
    }, [estadoTemporalSalaJogo]);

    const inventario = mapaLogico?.seresNaSala.find(ser => ser.papel === 'controlado')?.inventario ?? [];
    const podeSacarAgora = estadoTemporalSalaJogo !== null && estadoTemporalSalaJogo.status !== 'RODANDO' && !desativarAcoes;
    const acaoSaqueAtiva = estadoTemporalSalaJogo?.acoesTemporais.find(acaoTemporal => acaoTemporal.status === 'EM_ANDAMENTO' && acaoTemporal.tipo === 'sacar') ?? null;

    if (inventario.length === 0) return <div className={styles.inventario_vazio}>Inventário vazio.</div>;

    return (
        <div className={styles.painel_inventario}>
            {inventario.map(item => <ItemInventario key={item.key} item={item} podeSacar={item.estado === 'GUARDADO' && podeSacarAgora} restanteSaqueSegundos={obtemRestanteSaqueSegundos(item, acaoSaqueAtiva, momentoProjetadoMs)} aoSacar={() => executaSaqueItem(item.key)} />)}
        </div>
    );
};

function obtemRestanteSaqueSegundos(item: ItemInventarioSalaJogoWsDto, acaoSaque: AcaoTemporalSalaDeJogoRuntime | null, momentoAtualMs: number): number | null {
    if (item.estado !== 'SACANDO' || !acaoSaque || acaoSaque.saque?.keyItem !== item.key || acaoSaque.momentoFimPrevistoMs === null) return null;
    return Math.max(0, (acaoSaque.momentoFimPrevistoMs - momentoAtualMs) / 1000);
};

function ItemInventario({ item, podeSacar, restanteSaqueSegundos, aoSacar }: { item: ItemInventarioSalaJogoWsDto; podeSacar: boolean; restanteSaqueSegundos: number | null; aoSacar: () => void; }) {
    return (
        <div className={`${styles.item_inventario} ${item.estado === 'EMPUNHADO' ? styles.item_empunhado : ''}`}>
            <div className={styles.dados_item}>
                <strong>{item.nomeExibicao}</strong>
                <span className={styles.estado_item}>{ROTULOS_ESTADO_ITEM[item.estado]}{restanteSaqueSegundos !== null ? ` · ${restanteSaqueSegundos.toFixed(1)}s` : ''}</span>
            </div>
            {item.estado === 'GUARDADO' && <button type="button" className={styles.botao_sacar} disabled={!podeSacar} onClick={aoSacar}>Sacar</button>}
            {item.estado === 'EMPUNHADO' && <span className={styles.tag_empunhado}>Em mãos</span>}
        </div>
    );
};

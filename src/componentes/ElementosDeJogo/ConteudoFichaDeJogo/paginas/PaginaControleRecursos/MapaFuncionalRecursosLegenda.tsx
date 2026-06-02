import styles from './MapaFuncionalRecursosLegenda.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

type ItemLegendaMapaFuncional = {
    estado: RecursoFichaEmJogo['estadoResumo']['tipo'];
    nome: string;
};

const ITENS_LEGENDA_MAPA_FUNCIONAL: ItemLegendaMapaFuncional[] = [
    { estado: 'livre', nome: 'Funcional' },
    { estado: 'ocupado', nome: 'Ocupado / Executando' },
    { estado: 'indisponivel', nome: 'Indisponível / Bloqueado' },
];

export default function MapaFuncionalRecursosLegenda() {
    return (
        <div className={styles.legenda_mapa_funcional} aria-label="Legenda do mapa corporal">
            {ITENS_LEGENDA_MAPA_FUNCIONAL.map(item => (
                <span key={item.estado} className={styles.item_legenda_mapa}>
                    <span className={`${styles.marcador_legenda_mapa} ${obtemClasseEstadoLegenda(item.estado)}`} aria-hidden={true} />
                    <span className={styles.texto_legenda_mapa}>{item.nome}</span>
                </span>
            ))}
        </div>
    );
};

function obtemClasseEstadoLegenda(tipoEstado: RecursoFichaEmJogo['estadoResumo']['tipo']): string {
    if (tipoEstado === 'livre') return styles.marcador_livre;
    if (tipoEstado === 'indisponivel') return styles.marcador_indisponivel;
    return styles.marcador_ocupado;
};

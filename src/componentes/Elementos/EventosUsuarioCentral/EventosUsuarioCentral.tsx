'use client';

import styles from './styles.module.css';
import itemStyles from './item.module.css';
import EventosUsuarioTutorialIntervencao from './EventosUsuarioTutorialIntervencao';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

// Central mínima de eventos do usuário (Etapa 7): apenas renderiza; toda a lógica/estado vive no ContextoEventosUsuario.
// Etapa 17: o gatilho de acesso migrou para a Barra Flutuante; aqui ficam só o painel (quando aberto) e a intervenção do tutorial.
export default function EventosUsuarioCentral() {
    const { estaAutenticado } = useContextoAutenticacao();
    const { itens, carregando, aberto, listar, marcarLido, abrirTutorial } = useContextoEventosUsuario();

    if (!estaAutenticado) return null;

    return (
        <div className={styles.central}>
            {aberto && (
                <div className={styles.painel}>
                    <div className={styles.cabecalho}>
                        <span>Meus eventos</span>
                        <button type="button" className={styles.botao_atualizar} onClick={listar} disabled={carregando}>{carregando ? '...' : 'Atualizar'}</button>
                    </div>

                    {itens.length === 0 && <div className={styles.vazio}>Nenhum evento.</div>}

                    {itens.map(item => (
                        <div key={item.id} className={`${itemStyles.item} ${item.lido ? itemStyles.item_lido : itemStyles.item_nao_lido}`}>
                            <div className={itemStyles.item_cabecalho}>
                                <span className={itemStyles.item_titulo}>{item.titulo}</span>
                                <span className={itemStyles.item_rotulo_formato}>{item.rotuloFormato}</span>
                            </div>
                            <div className={itemStyles.item_mensagem}>{item.mensagem}</div>
                            {item.textoAuxiliar && <div className={itemStyles.item_texto_auxiliar}>{item.textoAuxiliar}</div>}
                            <div className={itemStyles.item_meta}>{item.dataCriacaoFormatada} · {item.rotuloLeitura}{item.rotuloConclusao ? ` · ${item.rotuloConclusao}` : ''}</div>
                            {item.podeAbrirTutorial && item.rotuloAcaoTutorial && <button type="button" className={itemStyles.botao_tutorial} onClick={() => abrirTutorial(item.id)}>{item.rotuloAcaoTutorial}</button>}
                            {item.podeMarcarComoLido && <button type="button" className={itemStyles.botao_marcar_lido} onClick={() => marcarLido(item.id)}>marcar como lido</button>}
                        </div>
                    ))}
                </div>
            )}

            <EventosUsuarioTutorialIntervencao />
        </div>
    );
};

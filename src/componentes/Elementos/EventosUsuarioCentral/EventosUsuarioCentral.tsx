'use client';

import styles from './styles.module.css';
import itemStyles from './item.module.css';
import EventosUsuarioTutorialIntervencao from './EventosUsuarioTutorialIntervencao';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { ALVO_VISUAL_CENTRAL_BOTAO } from 'Contextos/ContextoEventosUsuario/alvoVisualTutorial';

// Central mínima de eventos do usuário (Etapa 7): apenas renderiza; toda a lógica/estado vive no ContextoEventosUsuario.
export default function EventosUsuarioCentral() {
    const { estaAutenticado } = useContextoAutenticacao();
    const { itens, carregando, aberto, naoLidos, alternarAberto, listar, marcarLido, abrirTutorial, alvoVisualLocalizado } = useContextoEventosUsuario();

    if (!estaAutenticado) return null;

    return (
        <div className={`${styles.central} ${alvoVisualLocalizado === ALVO_VISUAL_CENTRAL_BOTAO ? styles.central_destaque_ativo : ''}`}>
            {/* Etapa 13: alvo visual estável do tutorial inicial (atributo = ATRIBUTO_ALVO_VISUAL_TUTORIAL). */}
            <button type="button" data-udm-tutorial={ALVO_VISUAL_CENTRAL_BOTAO} className={`${styles.botao_abrir} ${alvoVisualLocalizado === ALVO_VISUAL_CENTRAL_BOTAO ? styles.botao_abrir_destacado : ''}`} onClick={alternarAberto}>Eventos{naoLidos > 0 ? ` (${naoLidos})` : ''}</button>

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
                            <div className={itemStyles.item_meta}>{item.dataCriacaoFormatada} · {item.rotuloLeitura}</div>
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

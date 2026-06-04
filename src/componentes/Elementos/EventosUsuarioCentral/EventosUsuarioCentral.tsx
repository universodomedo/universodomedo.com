'use client';

import styles from './styles.module.css';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

// Central mínima de eventos do usuário (Etapa 7): apenas renderiza; toda a lógica/estado vive no ContextoEventosUsuario.
export default function EventosUsuarioCentral() {
    const { estaAutenticado } = useContextoAutenticacao();
    const { eventos, carregando, aberto, naoLidos, alternarAberto, listar, marcarLido } = useContextoEventosUsuario();

    if (!estaAutenticado) return null;

    return (
        <div className={styles.central}>
            <button type="button" className={styles.botao_abrir} onClick={alternarAberto}>Eventos{naoLidos > 0 ? ` (${naoLidos})` : ''}</button>

            {aberto && (
                <div className={styles.painel}>
                    <div className={styles.cabecalho}>
                        <span>Meus eventos</span>
                        <button type="button" className={styles.botao_atualizar} onClick={listar} disabled={carregando}>{carregando ? '...' : 'Atualizar'}</button>
                    </div>

                    {eventos.length === 0 && <div className={styles.vazio}>Nenhum evento.</div>}

                    {eventos.map(evento => (
                        <div key={evento.id} className={`${styles.item} ${evento.dataLeitura ? styles.item_lido : styles.item_nao_lido}`}>
                            <div className={styles.item_titulo}>{evento.titulo}</div>
                            <div className={styles.item_mensagem}>{evento.mensagem}</div>
                            <div className={styles.item_meta}>{evento.formato} · {formataData(evento.dataCriacao, 'dd/MM/yyyy HH:mm')} · {evento.dataLeitura ? 'lido' : 'não lido'}</div>
                            {!evento.dataLeitura && <button type="button" className={styles.botao_marcar_lido} onClick={() => marcarLido(evento.id)}>marcar como lido</button>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

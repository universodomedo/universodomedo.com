'use client';

import styles from './styles.module.css';
import itemStyles from './item.module.css';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import type { CentralItem } from 'Contextos/ContextoEventosUsuario/eventoUsuarioCentralItem';
import RefsDeCartao from 'Componentes/ElementosVisuais/RefsDeCartao/RefsDeCartao';

// Central agregada (Etapa 14): renderiza Pendências (eventos + tutoriais não concluídos) e Ajuda/Tutoriais (concluídos). Toda a lógica/estado vive no ContextoEventosUsuario.
// A Central só SOLICITA abertura de Tutorial por WS; quem renderiza o Tutorial é o RenderizadorTutorialModal global. Não conclui Tutorial aqui.
export default function EventosUsuarioCentral() {
    const { estaAutenticado } = useContextoAutenticacao();
    const { itensPendencias, itensAjudaTutoriais, carregando, aberto, alternarAberto, listar, marcarLido, solicitarAberturaTutorial } = useContextoEventosUsuario();

    if (!estaAutenticado) return null;
    if (!aberto) return null;

    return (
        <div className={styles.central}>
            <div className={styles.painel}>
                <div className={styles.cabecalho}>
                    <span>Meus eventos</span>
                    <button type="button" className={styles.botao_atualizar} onClick={listar} disabled={carregando}>{carregando ? '...' : 'Atualizar'}</button>
                </div>

                <div className={styles.secao_titulo}>Pendências</div>
                {itensPendencias.length === 0 && <div className={styles.vazio}>Nenhuma pendência.</div>}
                {itensPendencias.map(item => <CartaoCentral key={item.chave} item={item} marcarLido={marcarLido} solicitarAberturaTutorial={solicitarAberturaTutorial} aoNavegar={alternarAberto} />)}

                <div className={styles.secao_titulo}>Ajuda / Tutoriais</div>
                {itensAjudaTutoriais.length === 0 && <div className={styles.vazio}>Nenhum tutorial concluído.</div>}
                {itensAjudaTutoriais.map(item => <CartaoCentral key={item.chave} item={item} marcarLido={marcarLido} solicitarAberturaTutorial={solicitarAberturaTutorial} aoNavegar={alternarAberto} />)}
            </div>
        </div>
    );
};

function CartaoCentral({ item, marcarLido, solicitarAberturaTutorial, aoNavegar }: { item: CentralItem; marcarLido: (idEvento: number) => void; solicitarAberturaTutorial: (idUsuarioTutorial: number) => void; aoNavegar: () => void }) {
    if (item.tipoItem === 'tutorial') {
        return (
            <div className={`${itemStyles.item} ${itemStyles.item_tutorial}`}>
                <div className={itemStyles.item_cabecalho}>
                    <span className={itemStyles.item_titulo}>{item.titulo}</span>
                    <span className={itemStyles.item_rotulo_formato}>Tutorial</span>
                </div>
                <div className={itemStyles.item_meta}>{item.dataFormatada}{item.concluido ? ' · concluído' : ''}</div>
                <button type="button" className={itemStyles.botao_tutorial} onClick={() => solicitarAberturaTutorial(item.idUsuarioTutorial)}>{item.rotuloAcao}</button>
            </div>
        );
    }

    return (
        <div className={`${itemStyles.item} ${item.lido ? itemStyles.item_lido : itemStyles.item_nao_lido}`}>
            <div className={itemStyles.item_cabecalho}>
                <span className={itemStyles.item_titulo}>{item.titulo}</span>
                <span className={itemStyles.item_rotulo_formato}>{item.rotuloFormato}</span>
            </div>
            <div className={itemStyles.item_mensagem}><RefsDeCartao texto={item.mensagem} aoNavegar={aoNavegar} /></div>
            <div className={itemStyles.item_meta}>{item.dataFormatada} · {item.lido ? 'lido' : 'não lido'}</div>
            {item.podeMarcarComoLido && <button type="button" className={itemStyles.botao_marcar_lido} onClick={() => marcarLido(item.id)}>marcar como lido</button>}
        </div>
    );
};

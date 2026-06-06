'use client';

import styles from './styles.module.css';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import type { AcaoBarra } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { MODULOS_ACOES } from './definicoes-acoes';

function resolveVisivel(visivel: AcaoBarra['visivel']): boolean {
    return typeof visivel === 'function' ? visivel() : visivel;
};

export default function BarraAcoesFlutuante() {
    const { acoes, expandido, definirExpandido } = useContextoBarraAcoesFlutuante();

    const acoesVisiveis = acoes.filter(a => resolveVisivel(a.visivel));

    // Registradores e painéis são sempre montados — registradores precisam rodar
    // seus effects para decidir se registram ou não a ação. Painéis auto-gerenciam
    // sua visibilidade via contexto próprio (ex: chatAberto no ContextoChat).
    return (
        <>
            {MODULOS_ACOES.map(({ id, Registrador, Painel }) => (
                <span key={id} style={{ display: 'contents' }}>
                    {Registrador && <Registrador />}
                    {Painel && <Painel />}
                </span>
            ))}

            {/* Cápsula visual — só aparece quando há pelo menos uma ação visível.
                flex-direction: column-reverse mantém o toggle na base;
                ações crescem para cima conforme são adicionadas. */}
            {acoesVisiveis.length > 0 && (
                <div id={styles.capsula_barra_acoes}>
                    <button
                        id={styles.botao_toggle_capsula}
                        onClick={() => definirExpandido(!expandido)}
                        title={expandido ? 'Fechar' : 'Ações rápidas'}
                    >
                        {expandido ? '✕' : '⚡'}
                    </button>
                    {expandido && (
                        <>
                            <div className={styles.divisor_capsula} />
                            {acoesVisiveis.map(acao => (
                                <button
                                    key={acao.id}
                                    className={`${styles.item_capsula} ${acao.destacado ? styles.item_capsula_destacado : ''}`}
                                    onClick={acao.onClick}
                                    title={acao.rotulo}
                                    data-udm-tutorial={acao.atributoAlvo}
                                >
                                    {acao.icone}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

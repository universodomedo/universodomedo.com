'use client';

import styles from './RenderizadorTutorialModal.module.css';

import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { useContextoTutorialAbertura } from 'Contextos/ContextoTutorialAbertura/contexto';
import PalcoTutorialView from './PalcoTutorialView';

// Etapa 11: modal global do Tutorial. Overlay bloqueante sobre @radix-ui/react-dialog (reaproveita scroll-lock + focus-trap + foco inicial/restauração + aria-modal + inert). Clique-fora e Escape NÃO fecham; só os botões encerram.
// Etapa 12: ao montar a abertura vinculada, envia ACK (não espera imagem) — um por instância; Concluir chama o WS amarrado à instância; Fechar permanece local.
export default function RenderizadorTutorialModal() {
    const { aberturaAtual, indicePasso, instanciaAberturaId, botoes, erroConclusao, concluindo, avancar, voltar, fechar, concluir, confirmarAbertura } = useContextoTutorialAbertura();

    const vinculo = aberturaAtual?.usuarioTutorial ?? null;
    const ackRef = useRef<number | null>(null);
    // ACK por instância: dispara assim que o popup monta com o payload (estrutura inicial), sem esperar carregamento de imagem. Só vinculada; o ref-guard evita duplicar por rerender/StrictMode/troca de passo.
    useEffect(() => {
        if (!vinculo) return;
        if (ackRef.current === instanciaAberturaId) return;
        ackRef.current = instanciaAberturaId;
        confirmarAbertura(vinculo.id);
    }, [instanciaAberturaId, vinculo, confirmarAbertura]);

    if (!aberturaAtual) return null;

    const passo = aberturaAtual.tutorial.passos[indicePasso];
    if (!passo) return null;

    const textos = passo.botoes;
    const impedirFechamentoExterno = (evento: Event) => evento.preventDefault();

    return (
        <Dialog.Root open modal>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.conteudo} aria-describedby={undefined} onPointerDownOutside={impedirFechamentoExterno} onInteractOutside={impedirFechamentoExterno} onEscapeKeyDown={impedirFechamentoExterno}>
                    <Dialog.Title className={styles.titulo}>{aberturaAtual.tutorial.nome}</Dialog.Title>
                    <PalcoTutorialView larguraPercentual={aberturaAtual.tutorial.larguraPercentual} passo={passo} rodape={
                        <>
                            {botoes.voltar && <button type="button" className={styles.botao} onClick={voltar}>{textos.voltar}</button>}
                            {botoes.avancar && <button type="button" className={styles.botao} onClick={avancar}>{textos.avancar}</button>}
                            {botoes.concluir && vinculo && <button type="button" className={styles.botao} disabled={concluindo} onClick={() => concluir(vinculo.id, instanciaAberturaId)}>{textos.concluir}</button>}
                            {botoes.fechar && <button type="button" className={styles.botao} onClick={fechar}>{textos.fechar}</button>}
                        </>
                    } />
                    {erroConclusao && <small className={styles.erro}>{erroConclusao}</small>}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

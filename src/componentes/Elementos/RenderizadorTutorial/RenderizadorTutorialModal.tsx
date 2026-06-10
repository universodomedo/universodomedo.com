'use client';

import styles from './RenderizadorTutorialModal.module.css';

import * as Dialog from '@radix-ui/react-dialog';

import { useContextoTutorialAbertura } from 'Contextos/ContextoTutorialAbertura/contexto';
import PalcoTutorialView from './PalcoTutorialView';

// Etapa 11: modal global do Tutorial. Overlay bloqueante sobre @radix-ui/react-dialog (reaproveita scroll-lock + focus-trap + foco inicial/restauração + aria-modal + inert). Clique-fora e Escape NÃO fecham; só os botões encerram.
export default function RenderizadorTutorialModal() {
    const { aberturaAtual, indicePasso, botoes, avancar, voltar, fechar, concluir } = useContextoTutorialAbertura();
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
                            {botoes.concluir && <button type="button" className={styles.botao} onClick={concluir}>{textos.concluir}</button>}
                            {botoes.fechar && <button type="button" className={styles.botao} onClick={fechar}>{textos.fechar}</button>}
                        </>
                    } />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

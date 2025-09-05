import styles from './styles.module.css';
import { ReactNode } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function Modal({ children, open, onOpenChange }: { children: ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
};

function ModalContent({ children, cabecalho, className, temBotaoFechar = true, botaoAcaoPrincipal }: { children: ReactNode; cabecalho: { titulo: string; subtitulo?: string }; className?: string; temBotaoFechar?: boolean; botaoAcaoPrincipal?: { execucao: () => void; texto: string; desabilitado: boolean; } }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });
    
    return (
        <Dialog.Portal>
            <Dialog.Overlay className={styles.dialog_overlay} />
            <Dialog.Content className={`${styles.dialog_conteudo} ${className}`} aria-describedby={undefined}>
                <div id={styles.recipiente_cabecalho_modal}>
                    <Dialog.Title className={styles.dialog_titulo}>{cabecalho.titulo}</Dialog.Title>
                    {cabecalho.subtitulo && <h4>{cabecalho.subtitulo}</h4>}
                </div>
                <hr />
                <div className={styles.dialog_conteudo_corpo} {...scrollableProps}>
                    {children}
                </div>
                <hr />
                {(temBotaoFechar || botaoAcaoPrincipal) && (
                    <div className={styles.dialog_rodape}>
                        {temBotaoFechar && (
                            <Dialog.Close asChild>
                                <button className={styles.botao_modal} aria-label="Fechar">Fechar</button>
                            </Dialog.Close>
                        )}
                        {botaoAcaoPrincipal && (
                            <button className={styles.botao_modal} onClick={botaoAcaoPrincipal.execucao} disabled={botaoAcaoPrincipal.desabilitado}>{botaoAcaoPrincipal.texto}</button>
                        )}
                    </div>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    );
};

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
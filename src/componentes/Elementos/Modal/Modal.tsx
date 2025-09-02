// #region Imports
import styles from './styles.module.css';
import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
// #endregion

export default function Modal({ children, open, onOpenChange }: { children: ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
};

function ModalContent({ children, cabecalho, className, temBotaoFechar = true }: { children: ReactNode, cabecalho: { titulo: string; subtitulo?: string }, className?: string, temBotaoFechar?: boolean }) {
    return (
        <Dialog.Portal>
            <Dialog.Overlay className={styles.dialog_overlay} />
            <Dialog.Content className={`${styles.dialog_conteudo} ${className}`} aria-describedby={undefined}>
                <div id={styles.recipiente_cabecalho_modal}>
                    <Dialog.Title className={styles.dialog_titulo}>{cabecalho.titulo}</Dialog.Title>
                    {cabecalho.subtitulo && <h4>{cabecalho.subtitulo}</h4>}
                </div>
                <div className={styles.dialog_conteudo_corpo}>
                    {children}
                </div>
                {temBotaoFechar && (
                    <div className={styles.dialog_rodape}>
                        <Dialog.Close asChild>
                            <button className={styles.dialog_botao_fechar} aria-label="Fechar">Fechar</button>
                        </Dialog.Close>
                    </div>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    );
};

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
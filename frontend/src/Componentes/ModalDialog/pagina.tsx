// #region Imports
import style from './style.module.css';
import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
// #endregion

export default function Modal({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: ReactNode }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
}

function ModalContent({ children, title }: { children: ReactNode, title: string }) {
    return (
        <Dialog.Portal>
            <Dialog.Overlay className={style.dialog_overlay} />
            <Dialog.Content className={style.dialog_conteudo} aria-describedby={undefined}>
                <Dialog.Title className={style.dialog_titulo}>{title}</Dialog.Title>
                <div className={style.dialog_conteudo_corpo}>
                    {children}
                </div>
                <div className={style.dialog_rodape}>
                    <Dialog.Close asChild>
                        <button className={style.dialog_botao_fechar} aria-label="Fechar">Fechar</button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    );
}

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
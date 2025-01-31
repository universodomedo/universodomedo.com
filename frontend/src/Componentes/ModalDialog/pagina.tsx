// #region Imports
import style from './style.module.css';
import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
// #endregion

export default function Modal({open, onOpenChange, children} : {open: boolean, onOpenChange: (open: boolean) => void, children: ReactNode}) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
}

function ModalContent({title, children}: {title:string, children: ReactNode}) {
    return (
        <Dialog.Portal>
            <Dialog.Overlay className={style.dialog_overlay} />
            <Dialog.Content className={style.dialog_conteudo} aria-describedby={undefined}>
                <Dialog.Title className={style.dialog_titulo}>{title}</Dialog.Title>
                {/* <Dialog.Close asChild>
                    <button className={style.dialog_botao_fechar} aria-label="Fechar">
                        <Cross2Icon />
                    </button>
                </Dialog.Close> */}

                <div className={style.dialog_conteudo_corpo}>
                    {children}
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    );
}

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
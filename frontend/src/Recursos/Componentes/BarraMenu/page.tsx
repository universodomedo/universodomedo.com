// #region Imports
import { ReactNode } from 'react';
import style from './style.module.css';

import * as Menubar from "@radix-ui/react-menubar";
// #endregion


export default function BarraMenu({ children }: { children: ReactNode }) {
    return (
        <Menubar.Root className={style.barra_menu}>
            {children}
        </Menubar.Root>
    );
}

function BarraMenuItem({ children }: { children: ReactNode }) {
    return (
        <Menubar.Menu>
            {children}
        </Menubar.Menu>
    );
}

function BarraMenuObjetoItem({ children }: { children: ReactNode }) {
    return (
        <Menubar.Trigger className={style.menu_item}>
            {children}
        </Menubar.Trigger>
    );
}

function BarraMenuObjetoMenu({ children }: { children: ReactNode }) {
    return (
        <Menubar.Portal>
            <Menubar.Content className={style.menu_conteudo} align="start">
            {/* <Menubar.Content className={style.menu_conteudo} align="start" sideOffset={5} alignOffset={-3}> */}
                {children}
            </Menubar.Content>
        </Menubar.Portal>
    );
}

function BarraMenuObjetoMenuItem({ children, onSelect }: { children: ReactNode, onSelect: (event: Event) => void }) {
    return (
        <Menubar.Item className={style.objeto_menu_item} onSelect={onSelect}>
            {children}
        </Menubar.Item>
    );
}

function BarraMenuObjetoMenuSeparador() {
    return (
        <Menubar.Separator className={style.objeto_menu_separador} />
    );
}

// function BarraMenuObjetoMenuSubitem({ children }: { children: ReactNode }) {
//     <Menubar.Item>
//         {children}
//     </Menubar.Item>
// }

BarraMenu.Menu = BarraMenuItem;
BarraMenu.Trigger = BarraMenuObjetoItem;
BarraMenu.Portal = BarraMenuObjetoMenu;
BarraMenu.Item = BarraMenuObjetoMenuItem;
BarraMenu.Separator = BarraMenuObjetoMenuSeparador;
// BarraMenu.Sub

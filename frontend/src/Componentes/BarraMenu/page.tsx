// #region Imports
import { ReactNode } from 'react';
import style from './style.module.css';

import * as Menubar from "@radix-ui/react-menubar";

import { CheckIcon } from "@radix-ui/react-icons";
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
        <Menubar.Trigger>
        {/* <Menubar.Trigger className={style.menu_item}> */}
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

function BarraMenuObjetoMenuCheckboxItem({ children, checked, onCheckedChange }: { children: ReactNode, checked: boolean, onCheckedChange: (checked:boolean) => void; }) {
    return (
        <Menubar.CheckboxItem className={style.objeto_menu_checkboxitem} checked={checked} onCheckedChange={onCheckedChange}>
            <Menubar.ItemIndicator className={style.checkbox_indicator}>
                <CheckIcon />
            </Menubar.ItemIndicator>

            {children}
        </Menubar.CheckboxItem>
    )
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
BarraMenu.CheckboxItem = BarraMenuObjetoMenuCheckboxItem;
BarraMenu.Separator = BarraMenuObjetoMenuSeparador;
// BarraMenu.Sub
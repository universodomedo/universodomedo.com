// #region Imports
import { ReactNode } from 'react';
import style from './style.module.css';

import * as HoverCard from "@radix-ui/react-hover-card";
// #endregion

export default function TooltipPersistente({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: ReactNode }) {
    return (
        // <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={700} closeDelay={200}> quando tem esse delay, possibilita aquele click q buga tudo
        <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={0} closeDelay={0}>
            {children}
        </HoverCard.Root>
    );
}

function HoverCardTrigger({ children }: { children: ReactNode }) {
    return (
        <HoverCard.Trigger className={style.tooltip_gatilho} asChild>
            {children}
        </HoverCard.Trigger>
    );
}

function HoverCardContent({ children }: { children: ReactNode }) {
    return (
        <HoverCard.Portal>
            <HoverCard.Content className={style.hover_card_conteudo} sideOffset={5}>
                {children}
                <HoverCard.Arrow className={style.hover_card_flecha} />
            </HoverCard.Content>
        </HoverCard.Portal>
    );
}

TooltipPersistente.Trigger = HoverCardTrigger;
TooltipPersistente.Content = HoverCardContent;
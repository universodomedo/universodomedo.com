// #region Imports
import { ReactNode } from 'react';
import style from './style.module.css';

import * as HoverCard from "@radix-ui/react-hover-card";
// #endregion

export default function TooltipPersistente({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: ReactNode }) {
    return (
        <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={700}>
            {children}
        </HoverCard.Root>
    );
}

function HoverCardTrigger({ children }: { children: ReactNode }) {
    return (
        <HoverCard.Trigger asChild>
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








// function TooltipPersistenteConteudo({ gatilho, conteudo }: { gatilho: ReactNode, conteudo: ReactNode }) {
//     return (
//         <>
//             <HoverCard.Trigger asChild>
//                 {gatilho}
//             </HoverCard.Trigger>
//             <HoverCard.Portal>
//                 <HoverCard.Content className={style.hover_card_conteudo} style={{backgroundColor: 'white'}}>
//                     {conteudo}
//                     <HoverCard.Arrow className={style.hover_card_flecha} />
//                 </HoverCard.Content>
//             </HoverCard.Portal>
//         </>
//     );
// }

// TooltipPersistente.Gatilho = HoverCard.Trigger;
// TooltipPersistente.Conteudo = HoverCard.Content;
// TooltipPersistente.Content = TooltipPersistenteConteudo;
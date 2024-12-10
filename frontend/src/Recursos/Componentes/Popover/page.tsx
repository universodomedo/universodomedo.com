// #region Imports
import style from "./style.module.css";
import { ReactNode, useState } from 'react';

import * as Popover from "@radix-ui/react-popover";
// #endregion

const PopoverComponente: React.FC<{ trigger: () => ReactNode; content: (close: () => void) => ReactNode; }> = ({ trigger, content }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <div className={style.popover_trigger}>
                <Popover.Trigger asChild>
                    {trigger()}
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className={style.popover_content} sideOffset={5}>
                        {content(() => setOpen(false))}
                    </Popover.Content>
                </Popover.Portal>
            </div>
        </Popover.Root>
    );
};

export default PopoverComponente;
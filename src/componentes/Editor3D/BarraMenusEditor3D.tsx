'use client';

import styles from './Editor3D.module.css';

import { useState } from 'react';

import { MENUS_EDITOR_3D, type ComandoMenuEditor3D, type ItemMenuEditor3D } from './editor3D.menus';

interface BarraMenusEditor3DProps {
    readonly comandoDesabilitado: (comando: ComandoMenuEditor3D) => boolean;
    readonly aoComando: (comando: ComandoMenuEditor3D) => void;
};

export function BarraMenusEditor3D({ comandoDesabilitado, aoComando }: BarraMenusEditor3DProps) {
    const [menuAberto, setMenuAberto] = useState<string | null>(null);

    function acionaComando(comando: ComandoMenuEditor3D): void {
        if (comandoDesabilitado(comando)) return;
        setMenuAberto(null);
        aoComando(comando);
    };

    function renderizaItem(item: ItemMenuEditor3D) {
        if (item.itens) {
            return (
                <div key={item.rotulo} className={styles.item_com_submenu}>
                    <button type="button" className={styles.item_dropdown}>{item.rotulo}<span className={styles.seta_submenu}>▸</span></button>
                    <div className={styles.submenu}>{item.itens.map(renderizaItem)}</div>
                </div>
            );
        }
        const comando = item.comando;
        return <button key={item.rotulo} type="button" className={styles.item_dropdown} disabled={comando === undefined || comandoDesabilitado(comando)} onClick={() => comando !== undefined && acionaComando(comando)}>{item.rotulo}</button>;
    };

    return (
        <section className={styles.barra_menus} aria-label="Menus do Editor 3D" onMouseLeave={() => setMenuAberto(null)}>
            {menuAberto !== null && <div className={styles.fundo_menu} onClick={() => setMenuAberto(null)} />}

            {MENUS_EDITOR_3D.map(menu => (
                <div key={menu.rotulo} className={styles.menu} onMouseEnter={() => setMenuAberto(atual => atual !== null ? menu.rotulo : atual)}>
                    <button type="button" className={menuAberto === menu.rotulo ? styles.botao_menu_aberto : ''} aria-expanded={menuAberto === menu.rotulo} onClick={() => setMenuAberto(atual => atual === menu.rotulo ? null : menu.rotulo)}>{menu.rotulo}</button>
                    {menuAberto === menu.rotulo && <div className={styles.dropdown}>{menu.itens.map(renderizaItem)}</div>}
                </div>
            ))}
        </section>
    );
};

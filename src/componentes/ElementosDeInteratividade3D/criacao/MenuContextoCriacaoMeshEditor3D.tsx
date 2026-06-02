'use client';

import styles from './styles.module.css';

import { useEffect, useRef } from 'react';

import { ItemMenuCriacaoMeshEditor3D } from './ItemMenuCriacaoMeshEditor3D';
import { ItemMenuCriacaoPresetObjetoEditor3D } from './ItemMenuCriacaoPresetObjetoEditor3D';
import { presetsObjetosCenaEditor3D, type PresetObjetoCenaEditor3D } from '../editor/editor3D.presetsObjeto.tipos';
import { tiposMalhaEditor3D, type TipoMalhaEditor3D } from '../editor/editor3D.tipos';
import type { PosicaoMenuCriacaoMeshEditor3D } from './editor3D.criacaoMesh.tipos';

interface MenuContextoCriacaoMeshEditor3DProps {
    posicao: PosicaoMenuCriacaoMeshEditor3D;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
    criaPresetObjeto: (preset: PresetObjetoCenaEditor3D) => void;
};

export function MenuContextoCriacaoMeshEditor3D({ posicao, selecionaTipoMalha, criaPresetObjeto }: MenuContextoCriacaoMeshEditor3DProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const menu = menuRef.current;

        if (menu === null) return;

        menu.style.setProperty('--editor3d-menu-x', `${posicao.x}px`);
        menu.style.setProperty('--editor3d-menu-y', `${posicao.y}px`);
    }, [posicao]);

    return (
        <div ref={menuRef} className={styles.menuContextoCriacaoMesh} data-editor3d-menu-criacao="true">
            <div className={styles.cabecalhoMenuCriacaoMesh}>Add Mesh</div>

            {tiposMalhaEditor3D.map(tipo => <ItemMenuCriacaoMeshEditor3D key={tipo.key} tipo={tipo} selecionaTipoMalha={selecionaTipoMalha} />)}

            <div className={styles.cabecalhoMenuCriacaoMesh}>Presets</div>

            {presetsObjetosCenaEditor3D.map(preset => <ItemMenuCriacaoPresetObjetoEditor3D key={preset.key} preset={preset} criaPresetObjeto={criaPresetObjeto} />)}
        </div>
    );
};

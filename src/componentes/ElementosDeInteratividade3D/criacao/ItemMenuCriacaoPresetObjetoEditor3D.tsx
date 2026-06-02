'use client';

import styles from './styles.module.css';

import type { DefinicaoPresetObjetoCenaEditor3D, PresetObjetoCenaEditor3D } from '../editor/editor3D.presetsObjeto.tipos';

interface ItemMenuCriacaoPresetObjetoEditor3DProps {
    preset: DefinicaoPresetObjetoCenaEditor3D;
    criaPresetObjeto: (preset: PresetObjetoCenaEditor3D) => void;
};

export function ItemMenuCriacaoPresetObjetoEditor3D({ preset, criaPresetObjeto }: ItemMenuCriacaoPresetObjetoEditor3DProps) {
    return (
        <button className={styles.itemMenuCriacaoMesh} type="button" onClick={() => criaPresetObjeto(preset.key)}>
            <span>{preset.nome}</span>
            <strong>Preset</strong>
        </button>
    );
};

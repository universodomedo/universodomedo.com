'use client';

import styles from './styles.module.css';

import type { TipoMalhaEditor3D, TipoMalhaEditor3DDef } from '../editor/editor3D.tipos';

interface ItemMenuCriacaoMeshEditor3DProps {
    tipo: TipoMalhaEditor3DDef;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
};

export function ItemMenuCriacaoMeshEditor3D({ tipo, selecionaTipoMalha }: ItemMenuCriacaoMeshEditor3DProps) {
    return (
        <button className={styles.itemMenuCriacaoMesh} type="button" onClick={() => selecionaTipoMalha(tipo.key)}>
            <span>{tipo.nome}</span>
            <strong>{tipo.dimensao}</strong>
        </button>
    );
};
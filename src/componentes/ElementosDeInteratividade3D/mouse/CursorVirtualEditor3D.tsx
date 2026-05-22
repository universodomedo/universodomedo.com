'use client';

import styles from './styles.module.css';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function CursorVirtualEditor3D() {
    const { estado } = useEditor3DContexto();

    if (!estado.cursorVirtual.ativo) return null;

    return <div className={styles.cursorVirtualEditor3D} style={{ left: `${estado.cursorVirtual.x}px`, top: `${estado.cursorVirtual.y}px` }} />;
};
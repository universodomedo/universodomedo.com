'use client';

import styles from './styles.module.css';

import { Editor3DProvider } from './contexto/Editor3DContexto';
import { EspacoTrabalhoEditor3D } from './workspace/EspacoTrabalhoEditor3D';
import { PainelControlesEditor3D } from './paineis/PainelControlesEditor3D';

export function ElementosDeInteratividade3D() {
    return (
        <Editor3DProvider>
            <main className={styles.editor3D}>
                <EspacoTrabalhoEditor3D />

                <PainelControlesEditor3D />
            </main>
        </Editor3DProvider>
    );
};
'use client';

import styles from './styles.module.css';

import { Editor3DProvider } from './contexto/Editor3DContexto';
import { EspacoTrabalhoEditor3D } from './workspace/EspacoTrabalhoEditor3D';
import { PainelControlesEditor3D } from './paineis/PainelControlesEditor3D';
import { useMenuLateralDireitoEditor3D } from './layout/useMenuLateralDireitoEditor3D';

export function ElementosDeInteratividade3D() {
    const menuLateralDireito = useMenuLateralDireitoEditor3D();

    return (
        <Editor3DProvider>
            <main ref={menuLateralDireito.editorRef} className={`${styles.editor3D} ${menuLateralDireito.colapsado ? styles.editor3DMenuDireitoColapsado : ''}`} style={menuLateralDireito.estiloEditor}>
                <EspacoTrabalhoEditor3D />

                <PainelControlesEditor3D menuLateralDireito={menuLateralDireito} />
            </main>
        </Editor3DProvider>
    );
};
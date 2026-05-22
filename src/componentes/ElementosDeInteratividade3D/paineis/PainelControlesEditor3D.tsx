'use client';

import styles from './styles.module.css';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { PainelCenaColecaoEditor3D } from './PainelCenaColecaoEditor3D';
import { PainelTransformObjetoEditor3D } from './PainelTransformObjetoEditor3D';
import { PainelViewportEditor3D } from './PainelViewportEditor3D';

export function PainelControlesEditor3D() {
    const { estado } = useEditor3DContexto();
    const objetoSelecionado = estado.objetos.find(objeto => objeto.id === estado.idObjetoSelecionado) ?? null;

    return (
        <aside className={styles.painelControles}>
            <PainelCenaColecaoEditor3D />

            <PainelTransformObjetoEditor3D objetoSelecionado={objetoSelecionado} />

            <PainelViewportEditor3D />
        </aside>
    );
};
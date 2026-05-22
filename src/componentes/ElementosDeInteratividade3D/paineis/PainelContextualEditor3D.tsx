'use client';

import { PainelTransformObjetoEditor3D } from './PainelTransformObjetoEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelContextualEditor3D() {
    const { estado } = useEditor3DContexto();
    const objetoSelecionado = estado.modoOperacao === 'OBJETO' ? estado.objetos.find(objeto => objeto.id === estado.idObjetoSelecionado) ?? null : null;

    if (objetoSelecionado !== null) return <PainelTransformObjetoEditor3D objetoSelecionado={objetoSelecionado} />;

    return null;
};
'use client';

import { useMemo } from 'react';

import { AreaInterativa3D } from 'Componentes/ElementosDeInteratividade3D/AreaInterativa3D';
import { Editor3DProvider } from 'Componentes/ElementosDeInteratividade3D/contexto/Editor3DContexto';
import { criaAssinaturaAmbiente3DSalaJogo, criaEstadoAmbiente3DParaSalaJogo } from './Ambiente3DSalaJogo.helpers';
import type { DocumentoCena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';

interface Ambiente3DSalaJogoProps {
    readonly documento: DocumentoCena3DPrototipo;
};

export function Ambiente3DSalaJogo({ documento }: Ambiente3DSalaJogoProps) {
    const assinatura = useMemo(() => criaAssinaturaAmbiente3DSalaJogo(documento), [documento]);
    const estadoInicial = useMemo(() => criaEstadoAmbiente3DParaSalaJogo(documento), [documento]);

    return (
        <Editor3DProvider key={assinatura} estadoInicial={estadoInicial}>
            <AreaInterativa3D modoRenderizacao="JOGO" />
        </Editor3DProvider>
    );
};

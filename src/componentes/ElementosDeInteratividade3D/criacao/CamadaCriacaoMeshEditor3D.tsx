'use client';

import { MenuContextoCriacaoMeshEditor3D } from './MenuContextoCriacaoMeshEditor3D';
import { PainelParametrizacaoMeshEditor3D } from './PainelParametrizacaoMeshEditor3D';
import type { PosicaoMenuCriacaoMeshEditor3D } from './editor3D.criacaoMesh.tipos';
import type { TipoMalhaEditor3D } from '../editor/editor3D.tipos';

interface CamadaCriacaoMeshEditor3DProps {
    posicaoMenu: PosicaoMenuCriacaoMeshEditor3D | null;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
};

export function CamadaCriacaoMeshEditor3D({ posicaoMenu, selecionaTipoMalha }: CamadaCriacaoMeshEditor3DProps) {
    return (
        <>
            {posicaoMenu !== null && <MenuContextoCriacaoMeshEditor3D posicao={posicaoMenu} selecionaTipoMalha={selecionaTipoMalha} />}

            <PainelParametrizacaoMeshEditor3D />
        </>
    );
};
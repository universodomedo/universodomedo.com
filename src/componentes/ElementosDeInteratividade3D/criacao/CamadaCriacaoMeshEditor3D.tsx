'use client';

import { MenuContextoCriacaoMeshEditor3D } from './MenuContextoCriacaoMeshEditor3D';
import { PainelParametrizacaoMeshEditor3D } from './PainelParametrizacaoMeshEditor3D';
import type { PresetObjetoCenaEditor3D } from '../editor/editor3D.presetsObjeto.tipos';
import type { PosicaoMenuCriacaoMeshEditor3D } from './editor3D.criacaoMesh.tipos';
import type { TipoMalhaEditor3D } from '../editor/editor3D.tipos';

interface CamadaCriacaoMeshEditor3DProps {
    posicaoMenu: PosicaoMenuCriacaoMeshEditor3D | null;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
    criaPresetObjeto: (preset: PresetObjetoCenaEditor3D) => void;
};

export function CamadaCriacaoMeshEditor3D({ posicaoMenu, selecionaTipoMalha, criaPresetObjeto }: CamadaCriacaoMeshEditor3DProps) {
    return (
        <>
            {posicaoMenu !== null && <MenuContextoCriacaoMeshEditor3D posicao={posicaoMenu} selecionaTipoMalha={selecionaTipoMalha} criaPresetObjeto={criaPresetObjeto} />}

            <PainelParametrizacaoMeshEditor3D />
        </>
    );
};

'use client';

import { MenuContextoAplicacaoTransformEditor3D } from './MenuContextoAplicacaoTransformEditor3D';
import type { PosicaoMenuAplicacaoTransformEditor3D } from './editor3D.aplicacaoTransform.tipos';

interface CamadaAplicacaoTransformEditor3DProps {
    posicaoMenu: PosicaoMenuAplicacaoTransformEditor3D | null;
    aplicaRotationScale: () => void;
};

export function CamadaAplicacaoTransformEditor3D({ posicaoMenu, aplicaRotationScale }: CamadaAplicacaoTransformEditor3DProps) {
    return <>{posicaoMenu !== null && <MenuContextoAplicacaoTransformEditor3D posicao={posicaoMenu} aplicaRotationScale={aplicaRotationScale} />}</>;
};
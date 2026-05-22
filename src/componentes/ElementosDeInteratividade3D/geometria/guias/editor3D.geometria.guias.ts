import { corGradeBase, corGradeLuz, corOrigemBase, corOrigemLuz } from './editor3D.geometria.guiaCores';
import { criaGeometriaEditor3D } from '../editor3D.geometria.base';
import { criaGeometriaGradeEditor3D } from './editor3D.geometria.grade';
import { criaGuiaEixoCompletoEditor3D, criaGuiaEixoPositivoEditor3D, criaGuiaPontoEixoEditor3D } from './editor3D.geometria.eixos';
import type { GuiaEditor3D } from '../editor3D.geometria.types';
import type { PlanoGuiaEditor3D } from '../../editor/editor3D.camera';

export function criaGeometriasGuiaEditor3D(plano: PlanoGuiaEditor3D): GuiaEditor3D[] {
    const grade = { geometria: criaGeometriaGradeEditor3D(plano, 14, 28), corBase: corGradeBase, corLuz: corGradeLuz };

    if (plano === 'XZ') return [grade, criaGuiaEixoCompletoEditor3D('X', 14), criaGuiaEixoCompletoEditor3D('Z', 14)];
    if (plano === 'YZ') return [grade, criaGuiaEixoCompletoEditor3D('Y', 14), criaGuiaEixoCompletoEditor3D('Z', 14)];

    return [grade, criaGuiaEixoCompletoEditor3D('X', 14), criaGuiaEixoCompletoEditor3D('Y', 14)];
};

export function criaGeometriasOrigemEditor3D(): GuiaEditor3D[] { return [{ geometria: criaGeometriaEditor3D([0, 0, 0], [0, 0, 1], 'PONTOS'), corBase: corOrigemBase, corLuz: corOrigemLuz }]; };

export function criaGeometriasGizmoEixosEditor3D(): GuiaEditor3D[] {
    return [
        criaGuiaEixoPositivoEditor3D('X', 0.9),
        criaGuiaEixoPositivoEditor3D('Y', 0.9),
        criaGuiaEixoPositivoEditor3D('Z', 0.9),
        criaGuiaPontoEixoEditor3D('X', 0.9),
        criaGuiaPontoEixoEditor3D('Y', 0.9),
        criaGuiaPontoEixoEditor3D('Z', 0.9),
    ];
};
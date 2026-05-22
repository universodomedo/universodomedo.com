import { criaGeometriaEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';

export function criaGeometriaVerticeEditor3D(): GeometriaEditor3D { return criaGeometriaEditor3D([0, 0, 0], [0, 0, 1], 'PONTOS'); };
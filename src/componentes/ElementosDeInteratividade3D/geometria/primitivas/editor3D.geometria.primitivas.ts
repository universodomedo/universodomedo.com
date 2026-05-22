import { criaGeometriaCilindroEditor3D } from './editor3D.geometria.cilindro';
import { criaGeometriaCirculoEditor3D } from './editor3D.geometria.circulo';
import { criaGeometriaCuboEditor3D } from './editor3D.geometria.cubo';
import { criaGeometriaEsferaEditor3D } from './editor3D.geometria.esfera';
import { criaGeometriaPlanoEditor3D } from './editor3D.geometria.plano';
import { criaGeometriaVerticeEditor3D } from './editor3D.geometria.vertice';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { ObjetoCenaEditor3D } from '../../editor/editor3D.tipos';

export function criaGeometriaObjetoEditor3D(objeto: ObjetoCenaEditor3D): GeometriaEditor3D {
    if (objeto.tipo === 'VERTICE') return criaGeometriaVerticeEditor3D();
    if (objeto.tipo === 'PLANO_2D') return criaGeometriaPlanoEditor3D();
    if (objeto.tipo === 'CIRCULO_2D') return criaGeometriaCirculoEditor3D(objeto.quantidadeVertices);
    if (objeto.tipo === 'CUBO_3D') return criaGeometriaCuboEditor3D();
    if (objeto.tipo === 'CILINDRO_3D') return criaGeometriaCilindroEditor3D(objeto.quantidadeVertices);

    return criaGeometriaEsferaEditor3D(objeto.quantidadeVertices);
};
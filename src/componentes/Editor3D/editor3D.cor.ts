import { Color } from 'three';
import type { Vetor3CenaCanonicaEditor3D } from 'types-nora-api';

// Conversão de cor entre as duas linguagens do Editor: a UI fala HEX (`<input type="color">`), a CenaCanonica fala Vetor3 RGB.
// Vive à parte porque objeto, material e luz precisam das duas pontas — e o módulo de luz não pode importar o de serialização (ciclo).

export function corHexParaVetor3Editor3D(hex: string): Vetor3CenaCanonicaEditor3D { const cor = new Color(hex); return [cor.r, cor.g, cor.b]; };

export function vetor3ParaCorHexEditor3D(cor: Vetor3CenaCanonicaEditor3D): string { return `#${new Color(cor[0], cor[1], cor[2]).getHexString()}`; };
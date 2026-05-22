import { criaMatrizCenaCameraEditor3D, type CameraEditor3D } from '../editor/editor3D.camera';
import { criaMatrizPerspectiva, criaMatrizTranslacao, multiplicaMatriz4 } from '../editor/editor3D.matrizes';

export interface MatrizesCenaEditor3D {
    readonly perspectiva: Float32Array;
    readonly camera: Float32Array;
    readonly cena: Float32Array;
    readonly finalCena: Float32Array;
};

export function criaMatrizesCenaEditor3D(camera: CameraEditor3D, largura: number, altura: number): MatrizesCenaEditor3D {
    const proporcao = largura / altura;
    const perspectiva = criaMatrizPerspectiva(Math.PI / 3.2, proporcao, 0.1, 100);
    const matrizCamera = criaMatrizTranslacao(camera.deslocamentoX, camera.deslocamentoY, -4 / camera.zoom);
    const cena = criaMatrizCenaCameraEditor3D(camera);
    const finalCena = multiplicaMatriz4(perspectiva, multiplicaMatriz4(matrizCamera, cena));

    return { perspectiva, camera: matrizCamera, cena, finalCena };
};
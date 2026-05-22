import { CampoNumeroEditor3D } from '../controles/CampoNumeroEditor3D';

interface ControleVerticesMeshEditor3DProps {
    quantidadeVertices: number;
    quantidadeMinima: number;
    quantidadeMaxima: number;
    quantidadeAjustavel: boolean;
    defineQuantidadeVertices: (quantidadeVertices: number) => void;
};

export function ControleVerticesMeshEditor3D({ quantidadeVertices, quantidadeMinima, quantidadeMaxima, quantidadeAjustavel, defineQuantidadeVertices }: ControleVerticesMeshEditor3DProps) { return <CampoNumeroEditor3D rotulo="Número de Vértices" valor={quantidadeVertices} passo={1} minimo={quantidadeMinima} maximo={quantidadeMaxima} inteiro={true} desabilitado={!quantidadeAjustavel} atualizaValor={defineQuantidadeVertices} />; };
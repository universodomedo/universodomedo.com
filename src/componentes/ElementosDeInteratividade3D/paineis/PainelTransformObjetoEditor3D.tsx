import styles from './styles.module.css';

import { CampoNumeroEditor3D } from '../controles/CampoNumeroEditor3D';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { materiaisVisuaisEditor3D, type MaterialVisualEditor3D } from '../editor/editor3D.materialVisual.tipos';
import { shadersEditor3D, type ShaderEditor3D } from '../editor/editor3D.shader.tipos';
import type { CampoVetorMalhaEditor3D, IndiceVetor3Editor3D, ObjetoCenaEditor3D } from '../editor/editor3D.tipos';

interface PainelTransformObjetoEditor3DProps {
    objetoSelecionado: ObjetoCenaEditor3D | null;
};

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); }
function radianosParaGraus(valor: number): number { return Number((valor * (180 / Math.PI)).toFixed(2)); }

export function PainelTransformObjetoEditor3D({ objetoSelecionado }: PainelTransformObjetoEditor3DProps) {
    const { estado, acoes } = useEditor3DContexto();

    function atualizaVetor(campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number): void { acoes.atualizaVetorObjetoSelecionado(campo, indice, valor); }
    function defineShader(shader: ShaderEditor3D): void { acoes.defineShaderObjetoSelecionado(shader); }
    function aplicaMaterialVisual(materialVisual: MaterialVisualEditor3D): void { acoes.aplicaMaterialVisualObjetoSelecionado(materialVisual); }
    function obtemValorPainel(): string {
        if (estado.modoOperacao === 'EDICAO') return 'Edit Mode';
        if (estado.idsObjetosSelecionados.length <= 1) return objetoSelecionado?.nome ?? 'None';

        return `${estado.idsObjetosSelecionados.length} objetos`;
    };

    return (
        <PainelColapsavelEditor3D titulo="Transform" valor={obtemValorPainel()}>
            {estado.modoOperacao === 'EDICAO' && <div className={styles.painelTransformVazio}>Object Transform fica bloqueado em Edit Mode. A proxima etapa sera editar vertices, arestas e faces da mesh.</div>}

            {estado.modoOperacao === 'OBJETO' && objetoSelecionado === null && <div className={styles.painelTransformVazio}>Selecione um objeto na Scene Collection para editar.</div>}

            {estado.modoOperacao === 'OBJETO' && objetoSelecionado !== null && (
                <>
                    <div className={styles.campoOpcaoVisualObjetoEditor3D}>
                        <span>Shader</span>
                        <div className={styles.opcoesVisuaisObjetoEditor3D}>
                            {shadersEditor3D.map(shader => <button key={shader.key} className={`${styles.botaoOpcaoVisualObjetoEditor3D} ${objetoSelecionado.shader === shader.key ? styles.botaoOpcaoVisualObjetoEditor3DAtivo : ''}`} type="button" onClick={() => defineShader(shader.key)} aria-pressed={objetoSelecionado.shader === shader.key}>{shader.nome}</button>)}
                        </div>
                    </div>
                    <div className={styles.campoOpcaoVisualObjetoEditor3D}>
                        <span>Visual</span>
                        <div className={styles.opcoesVisuaisObjetoEditor3D}>
                            {materiaisVisuaisEditor3D.map(materialVisual => <button key={materialVisual.key} className={`${styles.botaoOpcaoVisualObjetoEditor3D} ${objetoSelecionado.materialVisual === materialVisual.key ? styles.botaoOpcaoVisualObjetoEditor3DAtivo : ''}`} type="button" onClick={() => aplicaMaterialVisual(materialVisual.key)} aria-pressed={objetoSelecionado.materialVisual === materialVisual.key}>{materialVisual.nome}</button>)}
                        </div>
                    </div>
                    <CampoNumeroEditor3D rotulo="Location X" valor={objetoSelecionado.posicao[0]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 0, valor)} />
                    <CampoNumeroEditor3D rotulo="Location Y" valor={objetoSelecionado.posicao[1]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 1, valor)} />
                    <CampoNumeroEditor3D rotulo="Location Z" valor={objetoSelecionado.posicao[2]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 2, valor)} />
                    <CampoNumeroEditor3D rotulo="Rotation X" valor={radianosParaGraus(objetoSelecionado.rotacao[0])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 0, grausParaRadianos(valor))} />
                    <CampoNumeroEditor3D rotulo="Rotation Y" valor={radianosParaGraus(objetoSelecionado.rotacao[1])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 1, grausParaRadianos(valor))} />
                    <CampoNumeroEditor3D rotulo="Rotation Z" valor={radianosParaGraus(objetoSelecionado.rotacao[2])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 2, grausParaRadianos(valor))} />
                    <CampoNumeroEditor3D rotulo="Scale X" valor={objetoSelecionado.escala[0]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 0, valor)} />
                    <CampoNumeroEditor3D rotulo="Scale Y" valor={objetoSelecionado.escala[1]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 1, valor)} />
                    <CampoNumeroEditor3D rotulo="Scale Z" valor={objetoSelecionado.escala[2]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 2, valor)} />
                </>
            )}
        </PainelColapsavelEditor3D>
    );
}

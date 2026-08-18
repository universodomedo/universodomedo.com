import { Euler, Matrix4, Mesh, Quaternion, Raycaster, Vector3 } from 'three';

import { criaGeometriaDeMalha, solidificaMalha, subdivideMalhaCatmullClark } from './editor3D.malha';
import type { MalhaEditavelLocal } from './editor3D.malha';
import type { TransformEditor3D } from './editor3D.projeto.serializacao';

// -------------------------------------------------------------------------------------------------------------------
// ASSENTAMENTO — definição ÚNICA (Programa Receita Única). O editor vivo assenta as meshes do viewport e a camada de
// operações assenta o estado puro: os DOIS chamam o mesmo cálculo aqui. Não há réplica analítica.
//
// Nada neste módulo depende de WebGL: Raycaster e Mesh do three são matemática (BufferGeometry + matriz), então o
// mesmo código roda no viewport e numa validação headless. É o que permite o roteiro gravado em qualquer interface ser
// revalidado sem tela.
// -------------------------------------------------------------------------------------------------------------------

const EPSILON_CHAO_EDITOR3D = 0.0001;
const TOLERANCIA_PENETRACAO_ASSENTAMENTO_EDITOR3D = 0.25;

// Z mínimo MUNDIAL da geometria de EXIBIÇÃO (pós-subdivisão/espessura) do mesh — só a geometria do objeto, sem os filhos (alças de edição). Z-up: o "para baixo" é -Z.
export function minimoMundialZMeshEditor3D(mesh: Mesh): number | null {
    mesh.updateMatrixWorld(true);
    mesh.geometry.computeBoundingBox();
    const caixa = mesh.geometry.boundingBox;
    if (caixa === null) return null;
    const minZ = caixa.clone().applyMatrix4(mesh.matrixWorld).min.z;
    return Number.isFinite(minZ) ? minZ : null;
};

// ASSENTAMENTO EM CAMADAS ("mapa tem gravidade") — Z-up: o piso vive no z=0 e todo objeto assenta na superfície mais alta
// abaixo da sua base — outro objeto (empilhamento) ou o chão. Sem física (R3F não tem gravidade nativa): raycast
// determinístico em 5 pontos da base (cantos + centro do bbox XY) — uma viga apoiada em duas paredes assenta nelas,
// não no vão. Também elimina o subsolo (apoio nunca fica abaixo de 0 — bug real da Cena 3D do Site afundada a -1.5).
export function assentaMeshNaCamadaEditor3D(mesh: Mesh, apoios: readonly Mesh[]): boolean {
    const minZ = minimoMundialZMeshEditor3D(mesh);
    if (minZ === null) return false;
    const caixa = mesh.geometry.boundingBox;
    if (caixa === null) return false;
    const caixaMundo = caixa.clone().applyMatrix4(mesh.matrixWorld);
    // O raio parte de POUCO ACIMA DA BASE (não do topo): apoio mais alto que a tolerância não eleva o objeto — senão
    // um contêiner (a sala) pularia para cima do próprio conteúdo (o cubo). A tolerância ainda des-interpenetra cascas
    // finas (base enfiada num piso de até 25cm sobe para o topo dele).
    const origemZ = minZ + TOLERANCIA_PENETRACAO_ASSENTAMENTO_EDITOR3D;
    const pontosBase: readonly [number, number][] = [
        [caixaMundo.min.x, caixaMundo.min.y],
        [caixaMundo.min.x, caixaMundo.max.y],
        [caixaMundo.max.x, caixaMundo.min.y],
        [caixaMundo.max.x, caixaMundo.max.y],
        [(caixaMundo.min.x + caixaMundo.max.x) / 2, (caixaMundo.min.y + caixaMundo.max.y) / 2],
    ];
    const raycaster = new Raycaster();
    const direcaoBaixo = new Vector3(0, 0, -1);
    let apoioZ = 0;
    for (const [x, y] of pontosBase) {
        raycaster.set(new Vector3(x, y, origemZ), direcaoBaixo);
        for (const alvo of apoios) {
            const impacto = raycaster.intersectObject(alvo, false)[0];
            if (impacto && impacto.point.z > apoioZ) apoioZ = impacto.point.z;
        }
    }
    const deslocamento = apoioZ - minZ;
    if (Math.abs(deslocamento) <= EPSILON_CHAO_EDITOR3D) return false;
    mesh.position.z += deslocamento;
    mesh.updateMatrix();
    return true;
};

// -------------------------------------------------------------------------------------------------------------------
// PONTE ESTADO → MESH: o objeto do estado puro vira uma mesh descartável (sem material, sem cena, sem renderer) só para
// o cálculo acima rodar sobre ele. A geometria é a de EXIBIÇÃO — subdivisão e depois espessura sobre a gaiola, na MESMA
// ordem do viewport —, porque é ela que decide onde a base do objeto realmente está.
// -------------------------------------------------------------------------------------------------------------------

export type ObjetoAssentavelEditor3D = {
    readonly malha: MalhaEditavelLocal;
    readonly subdivisao: number;
    readonly espessura: number;
    readonly transformInicial: TransformEditor3D;
    readonly visivel: boolean;
};

export function geometriaExibicaoEditor3D(objeto: Pick<ObjetoAssentavelEditor3D, 'malha' | 'subdivisao' | 'espessura'>) {
    const malhaSubdividida = objeto.subdivisao > 0 ? subdivideMalhaCatmullClark(objeto.malha, objeto.subdivisao) : objeto.malha;
    const malhaExibicao = objeto.espessura > 0 ? solidificaMalha(malhaSubdividida, objeto.espessura) : malhaSubdividida;
    return criaGeometriaDeMalha(malhaExibicao);
};

function meshDescartavelEditor3D(objeto: ObjetoAssentavelEditor3D, transform: TransformEditor3D): Mesh {
    const mesh = new Mesh(geometriaExibicaoEditor3D(objeto));
    mesh.position.set(transform.posicao[0], transform.posicao[1], transform.posicao[2]);
    mesh.rotation.set(transform.rotacao[0], transform.rotacao[1], transform.rotacao[2]);
    mesh.scale.set(transform.escala[0], transform.escala[1], transform.escala[2]);
    // matrixWorld (não só matrix): fora de uma cena ninguém a atualiza, e é ela que o Raycaster usa para posicionar o
    // apoio no mundo. Sem isto o apoio é testado como se estivesse na origem — e o objeto atravessa e cai no chão.
    mesh.updateMatrix();
    mesh.updateMatrixWorld(true);
    return mesh;
};

// Assenta um objeto do ESTADO sobre os apoios (os outros objetos visíveis do estado) e devolve o transform resultante.
// Descarta as geometrias temporárias: sem renderer não há contexto de GPU, mas os buffers ocupam memória.
export function transformAssentadoNoEstadoEditor3D(objeto: ObjetoAssentavelEditor3D, transform: TransformEditor3D, apoios: readonly ObjetoAssentavelEditor3D[]): TransformEditor3D {
    if (objeto.malha.vertices.length === 0) return transform;
    const mesh = meshDescartavelEditor3D(objeto, transform);
    const meshesApoio = apoios.filter(apoio => apoio.visivel && apoio.malha.vertices.length > 0).map(apoio => meshDescartavelEditor3D(apoio, apoio.transformInicial));
    try {
        if (!assentaMeshNaCamadaEditor3D(mesh, meshesApoio)) return transform;
        return { ...transform, posicao: [mesh.position.x, mesh.position.y, mesh.position.z] };
    } finally {
        mesh.geometry.dispose();
        for (const meshApoio of meshesApoio) meshApoio.geometry.dispose();
    }
};

// Matriz composta como o updateMatrix da mesh (posição / quaternion de Euler XYZ / escala) — usada pela serialização
// canônica para o estado reexecutado bater byte a byte com o vivo.
export function matrizDoTransformEditor3D(transform: TransformEditor3D): Matrix4 {
    return new Matrix4().compose(
        new Vector3(transform.posicao[0], transform.posicao[1], transform.posicao[2]),
        new Quaternion().setFromEuler(new Euler(transform.rotacao[0], transform.rotacao[1], transform.rotacao[2], 'XYZ')),
        new Vector3(transform.escala[0], transform.escala[1], transform.escala[2]),
    );
};

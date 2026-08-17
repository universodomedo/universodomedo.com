import { Box3, Euler, Matrix4, Quaternion, Vector3 } from 'three';

import { criaMalhaCubo } from './editor3D.malha';
import { COR_OBJETO_PADRAO_EDITOR3D } from './editor3D.projeto.serializacao';
import type { MalhaEditavelLocal } from './editor3D.malha';
import type { TransformEditor3D } from './editor3D.projeto.serializacao';
import type { ObjetoEditor3D } from './Editor3D';
import type { OperacaoRoteiroEditor3D, PassoRoteiroEditor3D } from 'types-nora-api';

// -------------------------------------------------------------------------------------------------------------------
// CAMADA DE OPERAÇÕES DE ROTEIRO — execução PURA (sem mesh, sem React, sem WebGL) das operações semânticas gravadas
// num Roteiro. É o que a validação reexecuta e compara com o golden; é também o que o stepping do Painel Roteiro
// repõe no editor. Cada operação nova do vocabulário entra AQUI e no ponto de gravação correspondente do Editor3D
// (de-mock reativo: só quando um roteiro precisar dela).
// -------------------------------------------------------------------------------------------------------------------

const EPSILON_CHAO_ROTEIRO_EDITOR3D = 0.0001;

// Estado puro da execução: o subconjunto da cena que o vocabulário manipula. `contadorObjetos` espelha a regra do
// contadorRef do editor (incrementa a cada criação, NUNCA reusa id) — é o que mantém os ids do roteiro determinísticos.
export type EstadoRoteiroEditor3D = {
    readonly objetos: readonly ObjetoEditor3D[];
    readonly contadorObjetos: number;
};

export const ESTADO_INICIAL_ROTEIRO_EDITOR3D: EstadoRoteiroEditor3D = { objetos: [], contadorObjetos: 0 };

export type ResultadoOperacaoRoteiroEditor3D = { readonly ok: true; readonly estado: EstadoRoteiroEditor3D } | { readonly ok: false; readonly motivo: string };

// Réplica ANALÍTICA do assentamento em camadas para execução headless, limitada ao CHÃO (sem apoios em outros objetos —
// empilhamento entra no vocabulário quando um roteiro precisar). Mesma aritmética do assentaMeshNaCamadaEditor3D:
// bbox local em float32 (como o computeBoundingBox da BufferGeometry), matriz composta como o updateMatrix da mesh,
// deslocamento = 0 - minZ mundial — para o estado reexecutado bater byte a byte com o editor vivo.
// Válida enquanto a geometria de EXIBIÇÃO é a própria gaiola (subdivisão 0 e espessura 0 — o vocabulário atual não as altera).
function transformAssentadoNoChaoRoteiroEditor3D(malha: MalhaEditavelLocal, transform: TransformEditor3D): TransformEditor3D {
    if (malha.vertices.length === 0) return transform;
    const caixa = new Box3();
    for (const vertice of malha.vertices) caixa.expandByPoint(new Vector3(Math.fround(vertice[0]), Math.fround(vertice[1]), Math.fround(vertice[2])));
    const matriz = new Matrix4().compose(new Vector3(transform.posicao[0], transform.posicao[1], transform.posicao[2]), new Quaternion().setFromEuler(new Euler(transform.rotacao[0], transform.rotacao[1], transform.rotacao[2], 'XYZ')), new Vector3(transform.escala[0], transform.escala[1], transform.escala[2]));
    const minZ = caixa.applyMatrix4(matriz).min.z;
    if (!Number.isFinite(minZ)) return transform;
    const deslocamento = 0 - minZ;
    if (Math.abs(deslocamento) <= EPSILON_CHAO_ROTEIRO_EDITOR3D) return transform;
    return { ...transform, posicao: [transform.posicao[0], transform.posicao[1], transform.posicao[2] + deslocamento] };
};

function objetoDaOperacao(estado: EstadoRoteiroEditor3D, idObjeto: number): ObjetoEditor3D | null { return estado.objetos.find(objeto => objeto.id === idObjeto) ?? null; };

export function aplicaOperacaoRoteiroEditor3D(estado: EstadoRoteiroEditor3D, operacao: OperacaoRoteiroEditor3D): ResultadoOperacaoRoteiroEditor3D {
    if (operacao.tipo === 'ADD_CUBO') {
        const id = estado.contadorObjetos + 1;
        const malha = criaMalhaCubo();
        // Mesmo nascimento do adicionaObjeto: origem do mundo, cor padrão, sem escalonamento — o assentamento ajusta o Z.
        const transformInicial = transformAssentadoNoChaoRoteiroEditor3D(malha, { posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] });
        const objeto: ObjetoEditor3D = { id, tipo: 'CUBO', nome: `Cubo ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, materiaisExtras: [], idPeca: null, visivel: true, malha, subdivisao: 0, espessura: 0, transformInicial };
        return { ok: true, estado: { objetos: [...estado.objetos, objeto], contadorObjetos: id } };
    }

    if (operacao.tipo === 'DEFINIR_COR_BASE') {
        const objeto = objetoDaOperacao(estado, operacao.idObjeto);
        if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
        return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === operacao.idObjeto ? { ...atual, cor: operacao.cor } : atual) } };
    }

    if (operacao.tipo === 'ESCALAR') {
        const objeto = objetoDaOperacao(estado, operacao.idObjeto);
        if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
        const transformEscalado: TransformEditor3D = { ...objeto.transformInicial, escala: [operacao.escala[0], operacao.escala[1], operacao.escala[2]] };
        const transformFinal = transformAssentadoNoChaoRoteiroEditor3D(objeto.malha, transformEscalado);
        return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === operacao.idObjeto ? { ...atual, transformInicial: transformFinal } : atual) } };
    }

    if (operacao.tipo === 'SOLIDIFICAR') {
        const objeto = objetoDaOperacao(estado, operacao.idObjeto);
        if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
        // Solidify é de EXIBIÇÃO e cresce para dentro: a gaiola (e o bbox do assentamento) não muda — sem re-assentar.
        return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === operacao.idObjeto ? { ...atual, espessura: operacao.espessura } : atual) } };
    }

    if (operacao.tipo === 'NOVO_MATERIAL') {
        const objeto = objetoDaOperacao(estado, operacao.idObjeto);
        if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
        // Mesmo nascimento do adicionaMaterialObjeto: nome sequencial (base é o 1) e cor clara padrão.
        return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === operacao.idObjeto ? { ...atual, materiaisExtras: [...atual.materiaisExtras, { nome: `Material ${atual.materiaisExtras.length + 2}`, cor: '#ede8d0' }] } : atual) } };
    }

    if (operacao.tipo === 'ATRIBUIR_MATERIAL') {
        const objeto = objetoDaOperacao(estado, operacao.idObjeto);
        if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
        const idsExistentes = new Set(objeto.malha.faces.map(face => face.id));
        const faceInexistente = operacao.idsFaces.find(idFace => !idsExistentes.has(idFace));
        if (faceInexistente !== undefined) return { ok: false, motivo: `Face ${faceInexistente} não existe em "${objeto.nome}"` };
        if (operacao.slot > objeto.materiaisExtras.length) return { ok: false, motivo: `Material ${operacao.slot} não existe em "${objeto.nome}"` };
        const alvo = new Set(operacao.idsFaces);
        const faces = objeto.malha.faces.map(face => alvo.has(face.id) ? { ...face, slotMaterial: operacao.slot <= 0 ? undefined : operacao.slot } : face);
        return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === operacao.idObjeto ? { ...atual, malha: { ...atual.malha, faces } } : atual) } };
    }

    return { ok: false, motivo: 'Operação não registrada na camada de operações' };
};

// Execução completa a partir do projeto em branco: estados[i] = estado após o passo i+1. Para no primeiro passo que
// falha — os três desfechos da validação saem daqui (completa e bate / completa e diverge / não completa).
export type ExecucaoRoteiroEditor3D = {
    readonly estados: readonly EstadoRoteiroEditor3D[];
    readonly falha: { readonly indicePasso: number; readonly motivo: string } | null;
};

export function executaPassosRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[]): ExecucaoRoteiroEditor3D {
    const estados: EstadoRoteiroEditor3D[] = [];
    let atual = ESTADO_INICIAL_ROTEIRO_EDITOR3D;
    for (let indice = 0; indice < passos.length; indice++) {
        const resultado = aplicaOperacaoRoteiroEditor3D(atual, passos[indice].operacao);
        if (!resultado.ok) return { estados, falha: { indicePasso: indice, motivo: resultado.motivo } };
        atual = resultado.estado;
        estados.push(atual);
    }
    return { estados, falha: null };
};

// Rótulo humano DERIVADO da operação (o roteiro não guarda rótulo): resolve o nome do objeto no estado ANTERIOR ao passo.
export function rotuloOperacaoRoteiroEditor3D(operacao: OperacaoRoteiroEditor3D, estadoAntes: EstadoRoteiroEditor3D): string {
    if (operacao.tipo === 'ADD_CUBO') return 'Adicionar cubo';
    const objeto = objetoDaOperacao(estadoAntes, operacao.idObjeto);
    const nome = objeto === null ? `objeto ${operacao.idObjeto}` : `"${objeto.nome}"`;
    if (operacao.tipo === 'DEFINIR_COR_BASE') return `Cor base de ${nome} → ${operacao.cor}`;
    if (operacao.tipo === 'ESCALAR') return `Escalar ${nome} → ${operacao.escala[0]} × ${operacao.escala[1]} × ${operacao.escala[2]}`;
    if (operacao.tipo === 'SOLIDIFICAR') return operacao.espessura === 0 ? `Paredes desligadas em ${nome}` : `Paredes de ${operacao.espessura} m em ${nome}`;
    if (operacao.tipo === 'NOVO_MATERIAL') return `Novo material em ${nome}`;
    return `${operacao.slot === 0 ? 'Material base' : `Material ${operacao.slot}`} → ${operacao.idsFaces.length} ${operacao.idsFaces.length === 1 ? 'face' : 'faces'} de ${nome}`;
};
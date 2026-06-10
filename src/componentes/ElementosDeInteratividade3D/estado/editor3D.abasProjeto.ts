import { criaCameraPadraoEditor3D } from '../editor/editor3D.camera';
import { serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import type { AbaProjeto3DEditor3D, Editor3DState } from './editor3D.estado.types';
import type { CameraEditor3D } from '../editor/editor3D.camera';
import type { CenaCanonicaEditor3D, Projeto3DMinimoPersistido } from 'types-nora-api/shared';

export function criaCenaCanonicaVaziaEditor3D(): CenaCanonicaEditor3D { return { versao: 1, objetos: [] }; };
export function criaAssinaturaCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): string { return JSON.stringify(cena); };

export function criaIdAbaProjeto3DEditor3D(id: number): string { return `aba-projeto-3d-${id}`; };
export function criaNomeNovoProjetoEditor3D(numero: number): string { return `Novo Projeto ${numero}`; };

export function criaAbaProjeto3DVaziaEditor3D(id: string, nome: string, camera: CameraEditor3D = criaCameraPadraoEditor3D()): AbaProjeto3DEditor3D {
    return { id, nome, projetoAberto: null, cenaCanonica: criaCenaCanonicaVaziaEditor3D(), assinaturaCenaSalva: null, camera };
};

export function criaAbaProjeto3DDeProjetoPersistidoEditor3D(id: string, projeto: Projeto3DMinimoPersistido, camera: CameraEditor3D = criaCameraPadraoEditor3D()): AbaProjeto3DEditor3D {
    return { id, nome: projeto.nome, projetoAberto: { id: projeto.id, nome: projeto.nome }, cenaCanonica: projeto.cenaCanonica, assinaturaCenaSalva: criaAssinaturaCenaCanonicaEditor3D(projeto.cenaCanonica), camera };
};

export function obtemAbaProjeto3DAtivaEditor3D(state: Editor3DState): AbaProjeto3DEditor3D | null { return state.abasProjeto3D.find(aba => aba.id === state.idAbaProjeto3DAtiva) ?? null; };

export function criaSnapshotAbaAtivaProjeto3DEditor3D(state: Editor3DState): AbaProjeto3DEditor3D | null {
    const abaAtiva = obtemAbaProjeto3DAtivaEditor3D(state);

    if (abaAtiva === null) return null;

    const cenaCanonica = serializaEditor3DParaCenaCanonica(state);
    const projetoAberto = state.projetoAberto;

    return { ...abaAtiva, nome: projetoAberto?.nome ?? abaAtiva.nome, projetoAberto, cenaCanonica, camera: state.camera };
};

export function atualizaAbaAtivaComSnapshotProjeto3DEditor3D(state: Editor3DState): Editor3DState {
    const snapshot = criaSnapshotAbaAtivaProjeto3DEditor3D(state);

    if (snapshot === null) return state;

    return { ...state, abasProjeto3D: state.abasProjeto3D.map(aba => aba.id === snapshot.id ? snapshot : aba) };
};

export function obtemAbasProjeto3DComAbaAtivaAtualEditor3D(state: Editor3DState): AbaProjeto3DEditor3D[] {
    const snapshot = criaSnapshotAbaAtivaProjeto3DEditor3D(state);

    if (snapshot === null) return [...state.abasProjeto3D];

    return state.abasProjeto3D.map(aba => aba.id === snapshot.id ? snapshot : aba);
};

export function obtemAbaProjeto3DAtivaAtualEditor3D(state: Editor3DState): AbaProjeto3DEditor3D | null {
    const snapshot = criaSnapshotAbaAtivaProjeto3DEditor3D(state);

    return snapshot ?? obtemAbaProjeto3DAtivaEditor3D(state);
};

export function abaProjeto3DTemAlteracaoNaoSalvaEditor3D(aba: AbaProjeto3DEditor3D): boolean {
    const assinaturaAtual = criaAssinaturaCenaCanonicaEditor3D(aba.cenaCanonica);

    if (aba.assinaturaCenaSalva === null) return aba.cenaCanonica.objetos.length > 0;

    return assinaturaAtual !== aba.assinaturaCenaSalva;
};
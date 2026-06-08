import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { PAYLOAD__SalvarProjeto3D } from 'types-nora-api/shared';

export function obtemBloqueioSalvamentoProjetoEditor3D(estado: Editor3DState): string | null {
    if (estado.objetos.length === 0) return 'Crie ao menos um objeto confirmado antes de salvar o projeto.';

    return obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);
};

export function criaPayloadSalvarNovoProjetoEditor3D(estado: Editor3DState, nome: string): PAYLOAD__SalvarProjeto3D {
    return { nome, cenaCanonica: serializaEditor3DParaCenaCanonica(estado) };
};

export function criaPayloadSalvarProjetoAtualEditor3D(estado: Editor3DState): PAYLOAD__SalvarProjeto3D | null {
    if (estado.projetoAberto === null) return null;

    return { idProjeto: estado.projetoAberto.id, nome: estado.projetoAberto.nome, cenaCanonica: serializaEditor3DParaCenaCanonica(estado) };
};
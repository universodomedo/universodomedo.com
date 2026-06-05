import type { DTO__CREATE__SerMembro } from 'types-nora-api';

export type MembroCadastroSer = {
    readonly idLocal: number;
    readonly nome: string;
    readonly capacidadesIds: readonly number[];
};

export function criaMembroCadastroSer(idLocal: number): MembroCadastroSer {
    return { idLocal, nome: '', capacidadesIds: [] };
};

export function atualizaNomeMembroCadastroSer(membros: readonly MembroCadastroSer[], idLocal: number, nome: string): readonly MembroCadastroSer[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, nome } : membro);
};

export function alternaCapacidadeMembroCadastroSer(membros: readonly MembroCadastroSer[], idLocal: number, idCapacidade: number): readonly MembroCadastroSer[] {
    return membros.map(membro => membro.idLocal === idLocal ? alternaCapacidadeMembro(membro, idCapacidade) : membro);
};

export function membrosCadastroSerSaoValidos(membros: readonly MembroCadastroSer[]): boolean {
    if (membros.length < 1) return false;

    return membros.every(membro => membro.nome.trim().length > 0 && membro.capacidadesIds.length > 0);
};

export function montaPayloadMembrosCadastroSer(membros: readonly MembroCadastroSer[]): readonly DTO__CREATE__SerMembro[] {
    return membros.map(membro => ({ nome: membro.nome.trim(), capacidadesIds: membro.capacidadesIds }));
};

function alternaCapacidadeMembro(membro: MembroCadastroSer, idCapacidade: number): MembroCadastroSer {
    if (membro.capacidadesIds.includes(idCapacidade)) return { ...membro, capacidadesIds: membro.capacidadesIds.filter(idAtual => idAtual !== idCapacidade) };

    return { ...membro, capacidadesIds: [...membro.capacidadesIds, idCapacidade] };
};
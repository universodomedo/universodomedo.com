import type { MembroSerJogavel, MembroSerJogavelInput } from 'types-nora-api';

export type MembroEditor = {
    readonly idLocal: number;
    readonly id: number | null;
    readonly nome: string;
    readonly idsCapacidadesInatas: readonly number[];
};

export function membroEditorVazio(idLocal: number): MembroEditor { return { idLocal, id: null, nome: '', idsCapacidadesInatas: [] }; };

export function membrosEditorDePersistidos(membros: readonly MembroSerJogavel[], proximoIdLocal: () => number): MembroEditor[] {
    return membros.map(membro => ({ idLocal: proximoIdLocal(), id: membro.id, nome: membro.nome, idsCapacidadesInatas: membro.idsCapacidadesInatas }));
};

export function atualizaNomeMembroEditor(membros: readonly MembroEditor[], idLocal: number, nome: string): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, nome } : membro);
};

export function alternaCapacidadeMembroEditor(membros: readonly MembroEditor[], idLocal: number, idCapacidade: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? alternaCapacidade(membro, idCapacidade) : membro);
};

export function membrosEditorSaoValidos(membros: readonly MembroEditor[]): boolean {
    if (membros.length < 1) return false;

    return membros.every(membro => membro.nome.trim().length > 0 && membro.idsCapacidadesInatas.length > 0);
};

export function obtemMensagemValidacaoMembrosEditor(membros: readonly MembroEditor[], totalCapacidades: number): string | null {
    if (totalCapacidades < 1) return 'Cadastre ao menos uma Capacidade Inata antes de configurar os membros.';
    if (membros.length < 1) return 'Adicione ao menos um membro.';
    if (membros.some(membro => membro.nome.trim().length < 1)) return 'Todos os membros precisam de nome.';
    if (membros.some(membro => membro.idsCapacidadesInatas.length < 1)) return 'Cada membro precisa de ao menos uma Capacidade Inata.';

    return null;
};

export function montaInputMembrosEditor(membros: readonly MembroEditor[]): readonly MembroSerJogavelInput[] {
    return membros.map(membro => ({ id: membro.id ?? undefined, nome: membro.nome.trim(), idsCapacidadesInatas: [...membro.idsCapacidadesInatas] }));
};

function alternaCapacidade(membro: MembroEditor, idCapacidade: number): MembroEditor {
    if (membro.idsCapacidadesInatas.includes(idCapacidade)) return { ...membro, idsCapacidadesInatas: membro.idsCapacidadesInatas.filter(id => id !== idCapacidade) };

    return { ...membro, idsCapacidadesInatas: [...membro.idsCapacidadesInatas, idCapacidade] };
};

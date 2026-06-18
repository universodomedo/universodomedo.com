import type { MembroSerJogavel, MembroSerJogavelInput } from 'types-nora-api';

export type AcaoMembroEditor = {
    readonly idLocal: number;
    readonly id: number | null;
    readonly nome: string;
    readonly idCapacidadeInata: number;
};

export type MembroEditor = {
    readonly idLocal: number;
    readonly id: number | null;
    readonly nome: string;
    readonly idsCapacidadesInatas: readonly number[];
    readonly acoes: readonly AcaoMembroEditor[];
};

export function membroEditorVazio(idLocal: number): MembroEditor { return { idLocal, id: null, nome: '', idsCapacidadesInatas: [], acoes: [] }; };

export function membrosEditorDePersistidos(membros: readonly MembroSerJogavel[], proximoIdLocal: () => number, proximoIdLocalAcao: () => number): MembroEditor[] {
    return membros.map(membro => ({ idLocal: proximoIdLocal(), id: membro.id, nome: membro.nome, idsCapacidadesInatas: membro.idsCapacidadesInatas, acoes: membro.acoes.map(acao => ({ idLocal: proximoIdLocalAcao(), id: acao.id, nome: acao.nome, idCapacidadeInata: acao.idCapacidadeInata })) }));
};

export function atualizaNomeMembroEditor(membros: readonly MembroEditor[], idLocal: number, nome: string): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, nome } : membro);
};

export function alternaCapacidadeMembroEditor(membros: readonly MembroEditor[], idLocal: number, idCapacidade: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? alternaCapacidade(membro, idCapacidade) : membro);
};

export function adicionaAcaoMembroEditor(membros: readonly MembroEditor[], idLocal: number, idLocalAcao: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, acoes: [...membro.acoes, { idLocal: idLocalAcao, id: null, nome: '', idCapacidadeInata: membro.idsCapacidadesInatas[0] ?? 0 }] } : membro);
};

export function removeAcaoMembroEditor(membros: readonly MembroEditor[], idLocal: number, idLocalAcao: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, acoes: membro.acoes.filter(acao => acao.idLocal !== idLocalAcao) } : membro);
};

export function atualizaNomeAcaoMembroEditor(membros: readonly MembroEditor[], idLocal: number, idLocalAcao: number, nome: string): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, acoes: membro.acoes.map(acao => acao.idLocal === idLocalAcao ? { ...acao, nome } : acao) } : membro);
};

export function atualizaCapacidadeAcaoMembroEditor(membros: readonly MembroEditor[], idLocal: number, idLocalAcao: number, idCapacidadeInata: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, acoes: membro.acoes.map(acao => acao.idLocal === idLocalAcao ? { ...acao, idCapacidadeInata } : acao) } : membro);
};

export function membrosEditorSaoValidos(membros: readonly MembroEditor[]): boolean {
    if (membros.length < 1) return false;

    return membros.every(membro => membro.nome.trim().length > 0 && membro.idsCapacidadesInatas.length > 0 && membro.acoes.every(acao => acao.nome.trim().length > 0 && membro.idsCapacidadesInatas.includes(acao.idCapacidadeInata)));
};

export function obtemMensagemValidacaoMembrosEditor(membros: readonly MembroEditor[], totalCapacidades: number): string | null {
    if (totalCapacidades < 1) return 'Cadastre ao menos uma Capacidade Inata antes de configurar os membros.';
    if (membros.length < 1) return 'Adicione ao menos um membro.';
    if (membros.some(membro => membro.nome.trim().length < 1)) return 'Todos os membros precisam de nome.';
    if (membros.some(membro => membro.idsCapacidadesInatas.length < 1)) return 'Cada membro precisa de ao menos uma Capacidade Inata.';
    if (membros.some(membro => membro.acoes.some(acao => acao.nome.trim().length < 1))) return 'Toda ação de membro precisa de nome.';
    if (membros.some(membro => membro.acoes.some(acao => !membro.idsCapacidadesInatas.includes(acao.idCapacidadeInata)))) return 'Toda ação precisa usar uma Capacidade Inata do próprio membro.';

    return null;
};

export function montaInputMembrosEditor(membros: readonly MembroEditor[]): readonly MembroSerJogavelInput[] {
    return membros.map(membro => ({ id: membro.id ?? undefined, nome: membro.nome.trim(), idsCapacidadesInatas: [...membro.idsCapacidadesInatas], acoes: membro.acoes.map(acao => ({ id: acao.id ?? undefined, nome: acao.nome.trim(), idCapacidadeInata: acao.idCapacidadeInata })) }));
};

function alternaCapacidade(membro: MembroEditor, idCapacidade: number): MembroEditor {
    if (membro.idsCapacidadesInatas.includes(idCapacidade)) return { ...membro, idsCapacidadesInatas: membro.idsCapacidadesInatas.filter(id => id !== idCapacidade), acoes: membro.acoes.filter(acao => acao.idCapacidadeInata !== idCapacidade) };

    return { ...membro, idsCapacidadesInatas: [...membro.idsCapacidadesInatas, idCapacidade] };
};
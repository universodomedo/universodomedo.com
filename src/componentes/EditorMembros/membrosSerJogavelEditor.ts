import { TIPOS_INTERACAO, type MembroSerJogavel, type MembroSerJogavelInput, type ParametrosCapacidadeMembroSerJogavel } from 'types-nora-api';

// Helpers PUROS do editor de membros do Ser jogavel. Os parametros vivem na CAPACIDADE do membro (a faculdade: o dano e do Membro, a visao e do Membro), nunca na acao. A validacao por tipo espelha o backend via TIPOS_INTERACAO (nunca literal).
export type CapacidadeInataMembroEditor = {
    readonly id: number;
    readonly nome: string;
    readonly nomeInteracao?: string;
};

// Parametros da capacidade em edicao (number | '' pra permitir campo vazio); o montaInput converte '' -> undefined.
export type ParametrosCapacidadeEditor = {
    readonly dano: number | '';
    readonly alcanceLinhaVisaoMilimetros: number | '';
    readonly idTipoVisao: number | '';
    readonly dependenciaIluminacaoPercentual: number | '';
};

export type CampoParametroCapacidadeEditor = keyof ParametrosCapacidadeEditor;

export type CapacidadeMembroEditor = {
    readonly idCapacidadeInata: number;
    readonly parametros: ParametrosCapacidadeEditor;
};

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
    readonly capacidades: readonly CapacidadeMembroEditor[];
    readonly acoes: readonly AcaoMembroEditor[];
};

export function idsCapacidadesDoMembroEditor(membro: MembroEditor): number[] { return membro.capacidades.map(capacidade => capacidade.idCapacidadeInata); };

export function membroEditorVazio(idLocal: number): MembroEditor { return { idLocal, id: null, nome: '', capacidades: [], acoes: [] }; };

export function membrosEditorDePersistidos(membros: readonly MembroSerJogavel[], proximoIdLocal: () => number, proximoIdLocalAcao: () => number): MembroEditor[] {
    return membros.map(membro => ({
        idLocal: proximoIdLocal(),
        id: membro.id,
        nome: membro.nome,
        capacidades: membro.capacidades.map(capacidade => ({ idCapacidadeInata: capacidade.idCapacidadeInata, parametros: parametrosCapacidadeDePersistidos(capacidade.parametros) })),
        acoes: membro.acoes.map(acao => ({ idLocal: proximoIdLocalAcao(), id: acao.id, nome: acao.nome, idCapacidadeInata: acao.idCapacidadeInata })),
    }));
};

export function atualizaNomeMembroEditor(membros: readonly MembroEditor[], idLocal: number, nome: string): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, nome } : membro);
};

export function alternaCapacidadeMembroEditor(membros: readonly MembroEditor[], idLocal: number, idCapacidade: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? alternaCapacidade(membro, idCapacidade) : membro);
};

export function atualizaParametroCapacidadeEditor(membros: readonly MembroEditor[], idLocal: number, idCapacidade: number, campo: CampoParametroCapacidadeEditor, valor: number | ''): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, capacidades: membro.capacidades.map(capacidade => capacidade.idCapacidadeInata === idCapacidade ? { ...capacidade, parametros: { ...capacidade.parametros, [campo]: valor } } : capacidade) } : membro);
};

export function adicionaAcaoMembroEditor(membros: readonly MembroEditor[], idLocal: number, idLocalAcao: number): readonly MembroEditor[] {
    return membros.map(membro => membro.idLocal === idLocal ? { ...membro, acoes: [...membro.acoes, { idLocal: idLocalAcao, id: null, nome: '', idCapacidadeInata: membro.capacidades[0]?.idCapacidadeInata ?? 0 }] } : membro);
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

export function membrosEditorSaoValidos(membros: readonly MembroEditor[], capacidades: readonly CapacidadeInataMembroEditor[]): boolean {
    if (membros.length < 1) return false;

    return membros.every(membro => membro.nome.trim().length > 0
        && membro.capacidades.length > 0
        && membro.capacidades.every(capacidade => mensagemParametroCapacidade(capacidade, capacidades) === null)
        && membro.acoes.every(acao => acao.nome.trim().length > 0 && idsCapacidadesDoMembroEditor(membro).includes(acao.idCapacidadeInata)));
};

export function obtemMensagemValidacaoMembrosEditor(membros: readonly MembroEditor[], capacidades: readonly CapacidadeInataMembroEditor[]): string | null {
    if (capacidades.length < 1) return 'Cadastre ao menos uma Capacidade Inata antes de configurar os membros.';
    if (membros.length < 1) return 'Adicione ao menos um membro.';
    if (membros.some(membro => membro.nome.trim().length < 1)) return 'Todos os membros precisam de nome.';
    if (membros.some(membro => membro.capacidades.length < 1)) return 'Cada membro precisa de ao menos uma Capacidade Inata.';

    for (const membro of membros) {
        for (const capacidade of membro.capacidades) {
            const mensagem = mensagemParametroCapacidade(capacidade, capacidades);
            if (mensagem) return mensagem;
        }
    }

    if (membros.some(membro => membro.acoes.some(acao => acao.nome.trim().length < 1))) return 'Toda ação de membro precisa de nome.';
    if (membros.some(membro => membro.acoes.some(acao => !idsCapacidadesDoMembroEditor(membro).includes(acao.idCapacidadeInata)))) return 'Toda ação precisa usar uma Capacidade Inata do próprio membro.';

    return null;
};

export function montaInputMembrosEditor(membros: readonly MembroEditor[]): readonly MembroSerJogavelInput[] {
    return membros.map(membro => ({
        id: membro.id ?? undefined,
        nome: membro.nome.trim(),
        capacidades: membro.capacidades.map(capacidade => ({ idCapacidadeInata: capacidade.idCapacidadeInata, parametros: montaParametrosInput(capacidade.parametros) })),
        acoes: membro.acoes.map(acao => ({ id: acao.id ?? undefined, nome: acao.nome.trim(), idCapacidadeInata: acao.idCapacidadeInata })),
    }));
};

function parametrosCapacidadeVazio(): ParametrosCapacidadeEditor {
    return { dano: '', alcanceLinhaVisaoMilimetros: '', idTipoVisao: '', dependenciaIluminacaoPercentual: '' };
};

function parametrosCapacidadeDePersistidos(parametros: ParametrosCapacidadeMembroSerJogavel): ParametrosCapacidadeEditor {
    return {
        dano: parametros.dano ?? '',
        alcanceLinhaVisaoMilimetros: parametros.alcanceLinhaVisaoMilimetros ?? '',
        idTipoVisao: parametros.idTipoVisao ?? '',
        dependenciaIluminacaoPercentual: parametros.dependenciaIluminacaoPercentual ?? '',
    };
};

function montaParametrosInput(parametros: ParametrosCapacidadeEditor): ParametrosCapacidadeMembroSerJogavel {
    return {
        dano: numeroOuUndefined(parametros.dano),
        alcanceLinhaVisaoMilimetros: numeroOuUndefined(parametros.alcanceLinhaVisaoMilimetros),
        idTipoVisao: numeroOuUndefined(parametros.idTipoVisao),
        dependenciaIluminacaoPercentual: numeroOuUndefined(parametros.dependenciaIluminacaoPercentual),
    };
};

function numeroOuUndefined(valor: number | ''): number | undefined { return valor === '' ? undefined : valor; };

function alternaCapacidade(membro: MembroEditor, idCapacidade: number): MembroEditor {
    if (membro.capacidades.some(capacidade => capacidade.idCapacidadeInata === idCapacidade)) return { ...membro, capacidades: membro.capacidades.filter(capacidade => capacidade.idCapacidadeInata !== idCapacidade), acoes: membro.acoes.filter(acao => acao.idCapacidadeInata !== idCapacidade) };

    return { ...membro, capacidades: [...membro.capacidades, { idCapacidadeInata: idCapacidade, parametros: parametrosCapacidadeVazio() }] };
};

// Mensagem de parametro invalido da capacidade conforme o Tipo de Interacao (afordancia derivada); null = valida.
function mensagemParametroCapacidade(capacidade: CapacidadeMembroEditor, catalogo: readonly CapacidadeInataMembroEditor[]): string | null {
    const info = catalogo.find(capacidadeCatalogo => capacidadeCatalogo.id === capacidade.idCapacidadeInata);
    const parametros = capacidade.parametros;

    if (info?.nomeInteracao === TIPOS_INTERACAO.DANIFICAVEL.chave) {
        if (!ehInteiroPositivo(parametros.dano)) return 'Capacidade Danificável precisa de dano inteiro positivo.';
    } else if (info?.nomeInteracao === TIPOS_INTERACAO.VISUAL.chave) {
        if (!ehInteiroPositivo(parametros.alcanceLinhaVisaoMilimetros)) return 'Percepção Visual precisa do Alcance da Linha de Visão (mm, inteiro positivo).';
        if (!ehInteiroPositivo(parametros.idTipoVisao)) return 'Percepção Visual precisa do Tipo de Visão.';
        if (!ehPercentual(parametros.dependenciaIluminacaoPercentual)) return 'Percepção Visual precisa da Dependência de Iluminação (0 a 100).';
    }

    return null;
};

function ehInteiroPositivo(valor: number | ''): boolean { return typeof valor === 'number' && Number.isInteger(valor) && valor > 0; };

function ehPercentual(valor: number | ''): boolean { return typeof valor === 'number' && valor >= 0 && valor <= 100; };

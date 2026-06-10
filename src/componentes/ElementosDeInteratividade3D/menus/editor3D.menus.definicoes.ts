export type PermissaoMenuEditor3D = 'CRIAR_INSIGNIA_HIDDEN';

export type IdComandoMenuEditor3D = 'NOVO_PROJETO' | 'SALVAR_NOVO_PROJETO' | 'SALVAR_PROJETO_ATUAL' | 'CARREGAR_PROJETO' | 'CRIAR_INSIGNIA' | 'CRIAR_ARTE_ESPECIAL' | 'TOOLBAR_2D';

export interface ContextoMenuEditor3D {
    readonly permissoes: readonly PermissaoMenuEditor3D[];
    readonly podeCriarNovoProjeto: boolean;
    readonly podeSalvarNovoProjeto: boolean;
    readonly podeSalvarProjetoAtual: boolean;
    readonly podeCarregarProjeto: boolean;
    readonly salvandoProjeto: boolean;
    readonly carregandoProjeto: boolean;
    readonly projetoAberto: boolean;
};

export interface ItemMenuEditor3D {
    readonly rotulo: string | ((contexto: ContextoMenuEditor3D) => string);
    readonly comando?: IdComandoMenuEditor3D;
    readonly disabled?: boolean | ((contexto: ContextoMenuEditor3D) => boolean);
    readonly permissao?: PermissaoMenuEditor3D;
    readonly itens?: readonly ItemMenuEditor3D[];
};

export interface MenuEditor3D {
    readonly rotulo: string;
    readonly itens: readonly ItemMenuEditor3D[];
};

export const MENUS_EDITOR_3D: readonly MenuEditor3D[] = [
    {
        rotulo: 'Projeto',
        itens: [
            { rotulo: 'Novo Projeto', comando: 'NOVO_PROJETO', disabled: contexto => !contexto.podeCriarNovoProjeto },
            { rotulo: 'Salvar Novo Projeto', comando: 'SALVAR_NOVO_PROJETO', disabled: contexto => !contexto.podeSalvarNovoProjeto },
            { rotulo: 'Salvar Projeto Atual', comando: 'SALVAR_PROJETO_ATUAL', disabled: contexto => !contexto.podeSalvarProjetoAtual },
            { rotulo: 'Carregar Projeto', comando: 'CARREGAR_PROJETO', disabled: contexto => !contexto.podeCarregarProjeto },
        ],
    },
    {
        rotulo: 'Criar',
        itens: [
            { rotulo: 'Criar Insignia', comando: 'CRIAR_INSIGNIA', permissao: 'CRIAR_INSIGNIA_HIDDEN', disabled: true },
            { rotulo: 'Criar Arte Especial', comando: 'CRIAR_ARTE_ESPECIAL', disabled: true },
        ],
    },
    {
        rotulo: 'Exibir',
        itens: [
            { rotulo: 'Toolbar 2D', comando: 'TOOLBAR_2D', disabled: true },
        ],
    },
];

export function itemMenuEditor3DEstaVisivel(item: ItemMenuEditor3D, contexto: ContextoMenuEditor3D): boolean { return item.permissao === undefined || contexto.permissoes.includes(item.permissao); };

export function itemMenuEditor3DEstaDesabilitado(item: ItemMenuEditor3D, contexto: ContextoMenuEditor3D): boolean {
    if (item.disabled === undefined) return true;
    if (typeof item.disabled === 'boolean') return item.disabled;

    return item.disabled(contexto);
};

export function obtemRotuloItemMenuEditor3D(item: ItemMenuEditor3D, contexto: ContextoMenuEditor3D): string { return typeof item.rotulo === 'string' ? item.rotulo : item.rotulo(contexto); };
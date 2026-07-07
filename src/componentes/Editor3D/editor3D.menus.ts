export type ComandoMenuEditor3D = 'NOVO_PROJETO' | 'SALVAR_PROJETO_ATUAL' | 'SALVAR_NOVO_PROJETO' | 'ABRIR_PROJETO' | 'CRIAR_CAPA_ARTE' | 'CRIAR_PERSONAGEM' | 'ADD_CUBO' | 'ADD_CILINDRO' | 'ADD_ESFERA' | 'NOVO_MESH' | 'CAPTURAR_ARTE_CAPA';

export interface ItemMenuEditor3D {
    readonly rotulo: string;
    readonly comando?: ComandoMenuEditor3D;
    readonly itens?: readonly ItemMenuEditor3D[];
};

export interface MenuEditor3D {
    readonly rotulo: string;
    readonly itens: readonly ItemMenuEditor3D[];
};

// Estrutura declarativa do toolbar (reescrita do legado). O habilitar/desabilitar de cada item é decidido pelo contexto do editor (comandoDesabilitado), não fica fixo aqui. Itens com `itens` viram submenu.
export const MENUS_EDITOR_3D: readonly MenuEditor3D[] = [
    {
        rotulo: 'Projeto',
        itens: [
            { rotulo: 'Novo Projeto', comando: 'NOVO_PROJETO' },
            { rotulo: 'Salvar Projeto', comando: 'SALVAR_PROJETO_ATUAL' },
            { rotulo: 'Salvar como Novo', comando: 'SALVAR_NOVO_PROJETO' },
            { rotulo: 'Abrir Projeto', comando: 'ABRIR_PROJETO' },
            { rotulo: 'Criar Especial', itens: [{ rotulo: 'Capa de Arte', comando: 'CRIAR_CAPA_ARTE' }, { rotulo: 'Personagem', comando: 'CRIAR_PERSONAGEM' }] },
        ],
    },
    {
        rotulo: 'Adicionar',
        itens: [
            { rotulo: 'Cubo', comando: 'ADD_CUBO' },
            { rotulo: 'Cilindro', comando: 'ADD_CILINDRO' },
            { rotulo: 'Esfera', comando: 'ADD_ESFERA' },
            { rotulo: 'Novo Mesh', comando: 'NOVO_MESH' },
        ],
    },
    {
        rotulo: 'Exibir',
        itens: [
            { rotulo: 'Capturar Arte de Capa', comando: 'CAPTURAR_ARTE_CAPA' },
        ],
    },
];

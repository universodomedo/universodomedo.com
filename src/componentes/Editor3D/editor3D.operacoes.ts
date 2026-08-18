import { aplicaOperacaoRoteiroEditor3D, ESTADO_INICIAL_ROTEIRO_EDITOR3D, rotuloDoOperadorEditor3D } from './editor3D.operadores';
import { MENUS_EDITOR_3D, type ItemMenuEditor3D } from './editor3D.menus';
import type { EstadoRoteiroEditor3D, TipoOperacaoEditor3D } from './editor3D.operadores';
import type { OperacaoRoteiroEditor3D, PassoRoteiroEditor3D } from 'types-nora-api';

// -------------------------------------------------------------------------------------------------------------------
// ROTEIRO SOBRE O REGISTRO — este módulo NÃO implementa operação nenhuma: ele executa sequências delas (reexecução do
// roteiro) e responde as duas perguntas de cada etapa. A implementação vive no registro de operadores, que é o mesmo
// que a tela invoca. Cada operação nova nasce lá e chega aqui de graça.
// -------------------------------------------------------------------------------------------------------------------

export { aplicaOperacaoRoteiroEditor3D, criaMalhaPrimitivaEditor3D, ESTADO_INICIAL_ROTEIRO_EDITOR3D, rotuloTipoPrimitivaEditor3D } from './editor3D.operadores';
export type { EstadoRoteiroEditor3D, ResultadoOperacaoRoteiroEditor3D, TipoOperacaoEditor3D } from './editor3D.operadores';

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

// -------------------------------------------------------------------------------------------------------------------
// AFORDÂNCIA — "esta etapa é realizável agora?". O menu declara qual OPERAÇÃO cada item dispara (como o
// `layout.operator(bl_idname)` do Blender), então o despacho do clique e a checagem da validação leem a MESMA
// declaração: mover de menu ou renomear o item não quebra nada; remover a entrada torna o passo inalcançável e a
// validação acusa. Operações de painel (cor, escala, materiais) não têm entrada de menu — não são checadas por aqui.
// -------------------------------------------------------------------------------------------------------------------

function trilhaItemPorOperacaoEditor3D(itens: readonly ItemMenuEditor3D[], tipo: TipoOperacaoEditor3D): string[] | null {
    for (const item of itens) {
        if (item.operacao === tipo) return [item.rotulo];
        if (item.itens) { const trilha = trilhaItemPorOperacaoEditor3D(item.itens, tipo); if (trilha !== null) return [item.rotulo, ...trilha]; }
    }

    return null;
};

// Caminho legível ATUAL da afordância ("Adicionar › Cubo"), derivado do menu declarativo: renomear ou mover o item
// atualiza o tutorial sozinho, sem tocar no roteiro. null quando a operação não tem (ou não tem mais) entrada de menu.
export function caminhoMenuDaOperacaoEditor3D(tipo: TipoOperacaoEditor3D): string | null {
    for (const menu of MENUS_EDITOR_3D) {
        const trilha = trilhaItemPorOperacaoEditor3D(menu.itens, tipo);
        if (trilha !== null) return [menu.rotulo, ...trilha].join(' › ');
    }

    return null;
};

// A operação nasce de menu? A resposta vem da DECLARAÇÃO do operador (afordancia), nunca de procurar no menu: se
// viesse do menu, remover a entrada faria as duas perguntas responderem "não existe" e a falta de porta jamais seria
// acusada. Reexportado do registro para haver um caminho só.
export { operacaoNasceDeMenuEditor3D } from './editor3D.operadores';

// Rótulo do passo: quando a operação tem entrada de menu, o caminho ATUAL dela é o rótulo (o tutorial acompanha a
// interface); senão, o rótulo declarado pelo próprio operador.
export function rotuloOperacaoRoteiroEditor3D(operacao: OperacaoRoteiroEditor3D, estadoAntes: EstadoRoteiroEditor3D): string {
    const caminho = caminhoMenuDaOperacaoEditor3D(operacao.tipo);

    return caminho !== null ? caminho : rotuloDoOperadorEditor3D(operacao, estadoAntes);
};

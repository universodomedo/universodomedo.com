import type { TipoProjetoEditor3D } from 'types-nora-api';

import type { ComandoMenuEditor3D } from './editor3D.menus';

// ---------------------------------------------------------------------------------------------------------------------
// COLEÇÕES DE SISTEMA — o domínio de "em que parte do projeto estou trabalhando".
//
// O header da árvore é um seletor entre coleções DE SISTEMA: lentes fixas que escopam árvore, menus, seleção e
// visualização. Não confundir com as coleções DO USUÁRIO (ColecaoEditor3D, o "+" da árvore): aquelas são pastas de
// organização e continuam existindo DENTRO das coleções de sistema que mostram geometria.
//
// MAPA trabalha em duas lentes: CENARIO (construir a sala — assets, materiais, cômodos, INCLUSIVE posicionar os objetos
// de iluminação) e ILUMINACAO (equilibrar as propriedades DE JOGO da luz + fiação, vendo a sala como o jogo mostra).
// O objeto Luz existe nas duas — o que muda é O QUE dele se edita: posição é cenário; tipo/cor/intensidade/alcance/
// alternável são jogo. Os demais tipos de projeto têm uma lente única (PROJETO, o editor sem gating). Tipos futuros
// estendem aqui (ex.: Personagem ganhará uma coleção de Membros) — a extensão é declarar a coleção, suas capacidades e
// em que tipos de projeto ela existe; nenhum consumidor precisa de if-por-tipo-de-projeto.
//
// Coleção de sistema é ESTADO DO EDITOR (preferência de sessão): nada disto persiste no projeto.
// ---------------------------------------------------------------------------------------------------------------------

export type TipoColecaoSistemaEditor3D = 'PROJETO' | 'CENARIO' | 'ILUMINACAO';

// PROJETO mantém o rótulo histórico do header ("Coleção da Cena"): "Coleção do Projeto" no dropdown do MAPA se mostrou
// ambíguo (o que teria o Projeto que o Cenário não tem?) e foi retirado.
export const ROTULO_COLECAO_SISTEMA_EDITOR3D: Record<TipoColecaoSistemaEditor3D, string> = { PROJETO: 'Coleção da Cena', CENARIO: 'Coleção de Cenário', ILUMINACAO: 'Coleção de Iluminação' };

// Estado de boot do editor (a aba Início nem tem árvore); a coleção real vem do clamp por tipo de projeto.
export const COLECAO_SISTEMA_INICIAL_EDITOR3D: TipoColecaoSistemaEditor3D = 'PROJETO';

// As coleções que EXISTEM para cada tipo de projeto, na ordem do dropdown.
export function colecoesSistemaDoTipoProjeto(tipoProjeto: TipoProjetoEditor3D): readonly TipoColecaoSistemaEditor3D[] {
    return tipoProjeto === 'MAPA' ? ['CENARIO', 'ILUMINACAO'] : ['PROJETO'];
};

// Onde um projeto ENTRA quando a coleção ativa não existe no tipo dele (troca de aba, abertura de projeto).
export function colecaoSistemaInicialDoTipoProjeto(tipoProjeto: TipoProjetoEditor3D): TipoColecaoSistemaEditor3D {
    return colecoesSistemaDoTipoProjeto(tipoProjeto)[0];
};

// --- Capacidades da coleção ativa (o que ela MOSTRA e o que ela EDITA) -----------------------------------------------
// O objeto Luz não passa por capacidade de "mostrar": ele aparece, se seleciona e se MOVE em toda coleção do MAPA — o
// que a lente restringe são as propriedades de jogo dele e a fiação.

export function colecaoMostraGeometria(colecao: TipoColecaoSistemaEditor3D): boolean {
    return colecao !== 'ILUMINACAO';
};

export function colecaoEditaGeometria(colecao: TipoColecaoSistemaEditor3D): boolean {
    return colecao !== 'ILUMINACAO';
};

// Fiação (Comandos: interruptores lógicos) é domínio de jogo puro — só a Iluminação a mostra e edita.
export function colecaoMostraFiacao(colecao: TipoColecaoSistemaEditor3D): boolean {
    return colecao === 'ILUMINACAO';
};

// Propriedades DE JOGO da luz (tipo, cor, intensidade, alcance, alternável): no Cenário a luz só se posiciona.
export function colecaoEditaJogoDaLuz(colecao: TipoColecaoSistemaEditor3D): boolean {
    return colecao === 'ILUMINACAO';
};

// A Iluminação É o modo de jogo — sem toggle: entrar nela apaga o estúdio e mostra a sala como o jogo mostra.
export function colecaoUsaIluminacaoDeJogo(colecao: TipoColecaoSistemaEditor3D): boolean {
    return colecao === 'ILUMINACAO';
};

// Comandos de menu que a coleção ativa permite (o gate por tipo de projeto continua sendo aplicado à parte pelo editor).
// ADD_LUZ fica fora das listas de propósito: colocar o OBJETO de iluminação é permitido em qualquer lente do MAPA.
// O Interruptor não tem comando de menu — é o vínculo objeto↔luz, nasce do gesto de fiação na Iluminação.
// Comandos que não mexem em conteúdo da cena (salvar/abrir/criar/capturar) não passam por aqui.
const COMANDOS_MENU_DE_GEOMETRIA: readonly ComandoMenuEditor3D[] = ['ADD_CUBO', 'ADD_CILINDRO', 'ADD_ESFERA', 'NOVO_MESH'];

export function colecaoPermiteComandoMenu(colecao: TipoColecaoSistemaEditor3D, comando: ComandoMenuEditor3D): boolean {
    if (COMANDOS_MENU_DE_GEOMETRIA.includes(comando)) return colecaoEditaGeometria(colecao);
    return true;
};

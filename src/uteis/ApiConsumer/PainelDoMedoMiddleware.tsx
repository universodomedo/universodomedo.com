import { PAYLOAD__CriarObjetivo, PAYLOAD__CriarColuna, PAYLOAD__CriarCard, PAYLOAD__CriarComentario, PAYLOAD__AtualizarCard, PAYLOAD__ReordenarCards, PAYLOAD__DefinirPosicaoFluxogramaCard, PAYLOAD__AtualizarColuna, PAYLOAD__DeletarColuna, PAYLOAD__ReordenarColunas, PAYLOAD__AtualizarObjetivo, PAYLOAD__SalvarDesenhoFluxograma, PAYLOAD__AtualizarObjetivoFicha, PAYLOAD__CriarItemChecklist, PAYLOAD__MarcarItemChecklist, PAYLOAD__AtualizarItemChecklist, PAYLOAD__DeletarItemChecklist, PAYLOAD__AdicionarMembroCard, PAYLOAD__RemoverMembroCard, PAYLOAD__CriarEtiqueta, PAYLOAD__AtualizarEtiqueta, PAYLOAD__DeletarEtiqueta, PAYLOAD__AplicarEtiquetaCard, PAYLOAD__RemoverEtiquetaCard, PAYLOAD__TrancarCard, PAYLOAD__TrancarObjetivo, PAYLOAD__AtualizarDescricaoCard, PAYLOAD__ListarAnexosCard, AnexoCardDto, RESPONSE__ResumoPainelDoMedoUsuario, PAYLOAD__ConcederPermissaoObjetivo, PAYLOAD__RevogarPermissaoObjetivo, PAYLOAD__TransformarItemEmCard, PAYLOAD__VincularCardChecklist } from 'types-nora-api';

import useApi from 'Uteis/ApiConsumer/Consumer.tsx';

export async function criaObjetivo(payload: PAYLOAD__CriarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/criaObjetivo', method: 'POST', data: payload });
};

export async function criaColuna(payload: PAYLOAD__CriarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/criaColuna', method: 'POST', data: payload });
};

export async function criaCard(payload: PAYLOAD__CriarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/criaCard', method: 'POST', data: payload });
};

export async function criaComentario(payload: PAYLOAD__CriarComentario): Promise<void> {
    await useApi<void>({ uri: '/comentarios/criaComentario', method: 'POST', data: payload });
};

export async function atualizaCard(payload: PAYLOAD__AtualizarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/atualizaCard', method: 'POST', data: payload });
};

export async function reordenaCards(payload: PAYLOAD__ReordenarCards): Promise<void> {
    await useApi<void>({ uri: '/cards/reordenaCards', method: 'POST', data: payload });
};

export async function definePosicaoFluxogramaCard(payload: PAYLOAD__DefinirPosicaoFluxogramaCard): Promise<void> {
    await useApi<void>({ uri: '/posicoesFluxogramaCards/definePosicao', method: 'POST', data: payload });
};

export async function atualizaColuna(payload: PAYLOAD__AtualizarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/atualizaColuna', method: 'POST', data: payload });
};

export async function deletaColuna(payload: PAYLOAD__DeletarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/deletaColuna', method: 'POST', data: payload });
};

export async function reordenaColunas(payload: PAYLOAD__ReordenarColunas): Promise<void> {
    await useApi<void>({ uri: '/colunas/reordenaColunas', method: 'POST', data: payload });
};

export async function atualizaObjetivo(payload: PAYLOAD__AtualizarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/atualizaObjetivo', method: 'POST', data: payload });
};

export async function salvaDesenhoFluxograma(payload: PAYLOAD__SalvarDesenhoFluxograma): Promise<void> {
    await useApi<void>({ uri: '/desenhosFluxograma/salvaDesenho', method: 'POST', data: payload });
};

export async function atualizaObjetivoFicha(payload: PAYLOAD__AtualizarObjetivoFicha): Promise<void> {
    await useApi<void>({ uri: '/objetivos/atualizaFicha', method: 'POST', data: payload });
};

export async function criaItemChecklist(payload: PAYLOAD__CriarItemChecklist): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/criaItem', method: 'POST', data: payload });
};

export async function marcaItemChecklist(payload: PAYLOAD__MarcarItemChecklist): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/marcaItem', method: 'POST', data: payload });
};

export async function atualizaItemChecklist(payload: PAYLOAD__AtualizarItemChecklist): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/atualizaItem', method: 'POST', data: payload });
};

export async function deletaItemChecklist(payload: PAYLOAD__DeletarItemChecklist): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/deletaItem', method: 'POST', data: payload });
};

export async function transformaItemChecklistEmCard(payload: PAYLOAD__TransformarItemEmCard): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/transformaEmCard', method: 'POST', data: payload });
};

export async function vinculaCardChecklist(payload: PAYLOAD__VincularCardChecklist): Promise<void> {
    await useApi<void>({ uri: '/itensChecklist/vinculaCard', method: 'POST', data: payload });
};

export async function adicionaMembroCard(payload: PAYLOAD__AdicionarMembroCard): Promise<void> {
    await useApi<void>({ uri: '/membrosCards/adicionaMembro', method: 'POST', data: payload });
};

export async function removeMembroCard(payload: PAYLOAD__RemoverMembroCard): Promise<void> {
    await useApi<void>({ uri: '/membrosCards/removeMembro', method: 'POST', data: payload });
};

export async function criaEtiqueta(payload: PAYLOAD__CriarEtiqueta): Promise<void> {
    await useApi<void>({ uri: '/etiquetas/criaEtiqueta', method: 'POST', data: payload });
};

export async function atualizaEtiqueta(payload: PAYLOAD__AtualizarEtiqueta): Promise<void> {
    await useApi<void>({ uri: '/etiquetas/atualizaEtiqueta', method: 'POST', data: payload });
};

export async function deletaEtiqueta(payload: PAYLOAD__DeletarEtiqueta): Promise<void> {
    await useApi<void>({ uri: '/etiquetas/deletaEtiqueta', method: 'POST', data: payload });
};

export async function concedePermissaoObjetivo(payload: PAYLOAD__ConcederPermissaoObjetivo): Promise<void> {
    await useApi<void>({ uri: '/permissoesObjetivos/concedePermissao', method: 'POST', data: payload });
};

export async function revogaPermissaoObjetivo(payload: PAYLOAD__RevogarPermissaoObjetivo): Promise<void> {
    await useApi<void>({ uri: '/permissoesObjetivos/revogaPermissao', method: 'POST', data: payload });
};

export async function listaAnexosDoCard(payload: PAYLOAD__ListarAnexosCard): Promise<AnexoCardDto[]> {
    const resposta = await useApi<AnexoCardDto[]>({ uri: '/anexosCards/listaDoCard', method: 'POST', data: payload });
    return resposta ?? [];
};

export async function resumoPainelDoMedo(): Promise<RESPONSE__ResumoPainelDoMedoUsuario | null> {
    return await useApi<RESPONSE__ResumoPainelDoMedoUsuario>({ uri: '/cards/resumoDoUsuario', method: 'POST', data: {} });
};

export async function atualizaDescricaoCard(payload: PAYLOAD__AtualizarDescricaoCard): Promise<void> {
    await useApi<void>({ uri: '/cards/atualizaDescricao', method: 'POST', data: payload });
};

export async function trancaCard(payload: PAYLOAD__TrancarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/trancaCard', method: 'POST', data: payload });
};

export async function trancaObjetivo(payload: PAYLOAD__TrancarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/trancaObjetivo', method: 'POST', data: payload });
};

export async function aplicaEtiquetaCard(payload: PAYLOAD__AplicarEtiquetaCard): Promise<void> {
    await useApi<void>({ uri: '/etiquetasCards/aplicaEtiqueta', method: 'POST', data: payload });
};

export async function removeEtiquetaCard(payload: PAYLOAD__RemoverEtiquetaCard): Promise<void> {
    await useApi<void>({ uri: '/etiquetasCards/removeEtiqueta', method: 'POST', data: payload });
};

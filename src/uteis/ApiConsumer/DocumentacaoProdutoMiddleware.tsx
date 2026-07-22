import type { PAYLOAD__CriarPersona, PAYLOAD__AtualizarPersona, PAYLOAD__CriarNecessidade, PAYLOAD__AtualizarNecessidade, PAYLOAD__CriarDocumentacaoPagina, PAYLOAD__AtualizarDocumentacaoPagina, PAYLOAD__VincularNecessidadeDocumentacao, PAYLOAD__AtualizarVinculoNecessidadeDocumentacao, PAYLOAD__RemoverVinculoNecessidadeDocumentacao, PAYLOAD__CriarLigacaoPaginas, PAYLOAD__RemoverLigacaoPaginas, PAYLOAD__DefinirPosicaoMapaPagina, PAYLOAD__CriarJornada, PAYLOAD__AtualizarJornada, PAYLOAD__AdicionarJornadaPasso, PAYLOAD__RemoverJornadaPasso, PAYLOAD__MoverJornadaPasso, PAYLOAD__CriarTipoSecao, PAYLOAD__AtualizarTipoSecao, PAYLOAD__CriarCta, PAYLOAD__AtualizarCta, PAYLOAD__VincularCtaPersona, PAYLOAD__RemoverCtaPersona, PAYLOAD__VincularPaginaCta, PAYLOAD__AtualizarPaginaCta, PAYLOAD__RemoverPaginaCta, PAYLOAD__CriarSecao, PAYLOAD__AtualizarSecao, PAYLOAD__RemoverSecao, PAYLOAD__MoverSecao, PAYLOAD__VincularSecaoPersona, PAYLOAD__RemoverSecaoPersona, PAYLOAD__VincularPaginaPersona, PAYLOAD__AtualizarGrauPaginaPersona, PAYLOAD__RemoverPaginaPersona, PAYLOAD__AdicionarMensagemChave, PAYLOAD__AtualizarMensagemChave, PAYLOAD__RemoverMensagemChave, PAYLOAD__MoverMensagemChave } from 'types-nora-api';

import useApi from 'Uteis/ApiConsumer/Consumer.tsx';

export async function criaPersona(payload: PAYLOAD__CriarPersona): Promise<void> {
    await useApi<void>({ uri: '/personas/criaPersona', method: 'POST', data: payload });
};

export async function atualizaPersona(payload: PAYLOAD__AtualizarPersona): Promise<void> {
    await useApi<void>({ uri: '/personas/atualizaPersona', method: 'POST', data: payload });
};

export async function criaNecessidade(payload: PAYLOAD__CriarNecessidade): Promise<void> {
    await useApi<void>({ uri: '/necessidades/criaNecessidade', method: 'POST', data: payload });
};

export async function atualizaNecessidade(payload: PAYLOAD__AtualizarNecessidade): Promise<void> {
    await useApi<void>({ uri: '/necessidades/atualizaNecessidade', method: 'POST', data: payload });
};

export async function criaDocumentacaoPagina(payload: PAYLOAD__CriarDocumentacaoPagina): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas/criaDocumentacao', method: 'POST', data: payload });
};

export async function atualizaDocumentacaoPagina(payload: PAYLOAD__AtualizarDocumentacaoPagina): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas/atualizaDocumentacao', method: 'POST', data: payload });
};

export async function vinculaNecessidadeDocumentacao(payload: PAYLOAD__VincularNecessidadeDocumentacao): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-necessidades/vinculaNecessidade', method: 'POST', data: payload });
};

export async function atualizaVinculoNecessidadeDocumentacao(payload: PAYLOAD__AtualizarVinculoNecessidadeDocumentacao): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-necessidades/atualizaVinculo', method: 'POST', data: payload });
};

export async function removeVinculoNecessidadeDocumentacao(payload: PAYLOAD__RemoverVinculoNecessidadeDocumentacao): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-necessidades/removeVinculo', method: 'POST', data: payload });
};

export async function criaLigacaoPaginas(payload: PAYLOAD__CriarLigacaoPaginas): Promise<void> {
    await useApi<void>({ uri: '/ligacoes-paginas/criaLigacao', method: 'POST', data: payload });
};

export async function removeLigacaoPaginas(payload: PAYLOAD__RemoverLigacaoPaginas): Promise<void> {
    await useApi<void>({ uri: '/ligacoes-paginas/removeLigacao', method: 'POST', data: payload });
};

export async function definePosicaoMapaPagina(payload: PAYLOAD__DefinirPosicaoMapaPagina): Promise<void> {
    await useApi<void>({ uri: '/posicoes-mapa-paginas/definePosicao', method: 'POST', data: payload });
};

export async function criaJornada(payload: PAYLOAD__CriarJornada): Promise<void> {
    await useApi<void>({ uri: '/jornadas/criaJornada', method: 'POST', data: payload });
};

export async function atualizaJornada(payload: PAYLOAD__AtualizarJornada): Promise<void> {
    await useApi<void>({ uri: '/jornadas/atualizaJornada', method: 'POST', data: payload });
};

export async function adicionaJornadaPasso(payload: PAYLOAD__AdicionarJornadaPasso): Promise<void> {
    await useApi<void>({ uri: '/jornadas-passos/adicionaPasso', method: 'POST', data: payload });
};

export async function removeJornadaPasso(payload: PAYLOAD__RemoverJornadaPasso): Promise<void> {
    await useApi<void>({ uri: '/jornadas-passos/removePasso', method: 'POST', data: payload });
};

export async function moveJornadaPasso(payload: PAYLOAD__MoverJornadaPasso): Promise<void> {
    await useApi<void>({ uri: '/jornadas-passos/movePasso', method: 'POST', data: payload });
};

// ===== Extensões Landing Page =====

export async function criaTipoSecao(payload: PAYLOAD__CriarTipoSecao): Promise<void> {
    await useApi<void>({ uri: '/tipos-secao/criaTipoSecao', method: 'POST', data: payload });
};

export async function atualizaTipoSecao(payload: PAYLOAD__AtualizarTipoSecao): Promise<void> {
    await useApi<void>({ uri: '/tipos-secao/atualizaTipoSecao', method: 'POST', data: payload });
};

export async function criaCta(payload: PAYLOAD__CriarCta): Promise<void> {
    await useApi<void>({ uri: '/ctas/criaCta', method: 'POST', data: payload });
};

export async function atualizaCta(payload: PAYLOAD__AtualizarCta): Promise<void> {
    await useApi<void>({ uri: '/ctas/atualizaCta', method: 'POST', data: payload });
};

export async function vinculaCtaPersona(payload: PAYLOAD__VincularCtaPersona): Promise<void> {
    await useApi<void>({ uri: '/ctas-personas/vinculaPersona', method: 'POST', data: payload });
};

export async function removeCtaPersona(payload: PAYLOAD__RemoverCtaPersona): Promise<void> {
    await useApi<void>({ uri: '/ctas-personas/removeVinculo', method: 'POST', data: payload });
};

export async function vinculaPaginaCta(payload: PAYLOAD__VincularPaginaCta): Promise<void> {
    await useApi<void>({ uri: '/paginas-ctas/vinculaCta', method: 'POST', data: payload });
};

export async function atualizaPaginaCta(payload: PAYLOAD__AtualizarPaginaCta): Promise<void> {
    await useApi<void>({ uri: '/paginas-ctas/atualizaVinculo', method: 'POST', data: payload });
};

export async function removePaginaCta(payload: PAYLOAD__RemoverPaginaCta): Promise<void> {
    await useApi<void>({ uri: '/paginas-ctas/removeVinculo', method: 'POST', data: payload });
};

export async function criaSecao(payload: PAYLOAD__CriarSecao): Promise<void> {
    await useApi<void>({ uri: '/secoes/criaSecao', method: 'POST', data: payload });
};

export async function atualizaSecao(payload: PAYLOAD__AtualizarSecao): Promise<void> {
    await useApi<void>({ uri: '/secoes/atualizaSecao', method: 'POST', data: payload });
};

export async function removeSecao(payload: PAYLOAD__RemoverSecao): Promise<void> {
    await useApi<void>({ uri: '/secoes/removeSecao', method: 'POST', data: payload });
};

export async function moveSecao(payload: PAYLOAD__MoverSecao): Promise<void> {
    await useApi<void>({ uri: '/secoes/moveSecao', method: 'POST', data: payload });
};

export async function vinculaSecaoPersona(payload: PAYLOAD__VincularSecaoPersona): Promise<void> {
    await useApi<void>({ uri: '/secoes-personas/vinculaPersona', method: 'POST', data: payload });
};

export async function removeSecaoPersona(payload: PAYLOAD__RemoverSecaoPersona): Promise<void> {
    await useApi<void>({ uri: '/secoes-personas/removeVinculo', method: 'POST', data: payload });
};

export async function vinculaPaginaPersona(payload: PAYLOAD__VincularPaginaPersona): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-personas/vinculaPersona', method: 'POST', data: payload });
};

export async function atualizaGrauPaginaPersona(payload: PAYLOAD__AtualizarGrauPaginaPersona): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-personas/atualizaGrau', method: 'POST', data: payload });
};

export async function removePaginaPersona(payload: PAYLOAD__RemoverPaginaPersona): Promise<void> {
    await useApi<void>({ uri: '/documentacoes-paginas-personas/removeVinculo', method: 'POST', data: payload });
};

export async function adicionaMensagemChave(payload: PAYLOAD__AdicionarMensagemChave): Promise<void> {
    await useApi<void>({ uri: '/mensagens-chave/adicionaMensagem', method: 'POST', data: payload });
};

export async function atualizaMensagemChave(payload: PAYLOAD__AtualizarMensagemChave): Promise<void> {
    await useApi<void>({ uri: '/mensagens-chave/atualizaMensagem', method: 'POST', data: payload });
};

export async function removeMensagemChave(payload: PAYLOAD__RemoverMensagemChave): Promise<void> {
    await useApi<void>({ uri: '/mensagens-chave/removeMensagem', method: 'POST', data: payload });
};

export async function moveMensagemChave(payload: PAYLOAD__MoverMensagemChave): Promise<void> {
    await useApi<void>({ uri: '/mensagens-chave/moveMensagem', method: 'POST', data: payload });
};
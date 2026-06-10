import type { BlocoTutorial, PassoTutorial } from 'types-nora-api';

import type { BlocoLocalTutorial, PassoLocalTutorial, ResultadoMontaComposicaoTutorial } from './tutorialEditor.types';

// Monta a composição para o payload (segura por construção): falha explícita se um bloco de imagem não tiver idImagem (sem sentinela). larguraPercentual entra direto.
export function montaComposicaoVisualTutorial(passos: readonly PassoLocalTutorial[], larguraPercentual: number): ResultadoMontaComposicaoTutorial {
    const passosMontados: PassoTutorial[] = [];
    for (const passo of passos) {
        const blocos: BlocoTutorial[] = [];
        for (const bloco of passo.blocos) {
            const resultado = montaBloco(bloco);
            if (!resultado.ok) return resultado;
            blocos.push(resultado.bloco);
        }
        passosMontados.push(montaPasso(passo, blocos));
    }
    return { ok: true, composicao: { larguraPercentual, passos: passosMontados } };
};

function montaBloco(bloco: BlocoLocalTutorial): { ok: true; bloco: BlocoTutorial } | { ok: false; motivo: string } {
    if (bloco.tipo === 'texto') return { ok: true, bloco: { tipo: 'texto', markdown: bloco.markdown, area: bloco.area } };
    if (bloco.idImagem === null) return { ok: false, motivo: 'Há um bloco de imagem sem imagem selecionada.' };
    return { ok: true, bloco: { tipo: 'imagem', idImagem: bloco.idImagem, area: bloco.area } };
};

function montaPasso(passo: PassoLocalTutorial, blocos: BlocoTutorial[]): PassoTutorial {
    const montado: PassoTutorial = { blocos };
    if (passo.textoBotaoVoltar !== undefined) montado.textoBotaoVoltar = passo.textoBotaoVoltar;
    if (passo.textoBotaoAvancar !== undefined) montado.textoBotaoAvancar = passo.textoBotaoAvancar;
    if (passo.textoBotaoConcluir !== undefined) montado.textoBotaoConcluir = passo.textoBotaoConcluir;
    if (passo.textoBotaoFechar !== undefined) montado.textoBotaoFechar = passo.textoBotaoFechar;
    return montado;
};

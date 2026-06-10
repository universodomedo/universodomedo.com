import type { TutorialGraphqlDto } from 'types-nora-api';

import type { BlocoLocalTutorial, PassoLocalTutorial } from './tutorialEditor.types';

// Composição lida da edição: derivada do contrato GraphQL gerado da leitura Tutorial (sem espelho manual).
type ComposicaoVisualTutorialLeitura = NonNullable<TutorialGraphqlDto['composicaoVisual']>;
type BlocoTutorialLeitura = ComposicaoVisualTutorialLeitura['passos'][number]['blocos'][number];

export function larguraDeComposicaoLeitura(composicao: ComposicaoVisualTutorialLeitura | null, larguraPadrao: number): number { return composicao?.larguraPercentual ?? larguraPadrao; };

export function passosLocaisDeComposicao(composicao: ComposicaoVisualTutorialLeitura | null, gerarIdLocal: () => number): readonly PassoLocalTutorial[] {
    if (!composicao || composicao.passos.length < 1) return [{ idLocal: gerarIdLocal(), blocos: [] }];
    return composicao.passos.map(passo => ({
        idLocal: gerarIdLocal(),
        blocos: passo.blocos.map(bloco => blocoLocalDeLeitura(bloco, gerarIdLocal())),
        textoBotaoVoltar: passo.textoBotaoVoltar ?? undefined,
        textoBotaoAvancar: passo.textoBotaoAvancar ?? undefined,
        textoBotaoConcluir: passo.textoBotaoConcluir ?? undefined,
        textoBotaoFechar: passo.textoBotaoFechar ?? undefined,
    }));
};

function blocoLocalDeLeitura(bloco: BlocoTutorialLeitura, idLocal: number): BlocoLocalTutorial {
    if (bloco.tipo === 'imagem') return { idLocal, tipo: 'imagem', markdown: '', idImagem: bloco.idImagem, area: bloco.area };
    if (bloco.tipo === 'texto') return { idLocal, tipo: 'texto', markdown: bloco.markdown ?? '', idImagem: null, area: bloco.area };
    throw new Error(`Tipo de bloco desconhecido recebido do contrato: ${bloco.tipo}`);
};

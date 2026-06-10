// Etapa 11: política canônica de visibilidade dos botões do Tutorial (editor + renderizador final). Fonte única; sem React/estado.
// A EXISTÊNCIA de cada botão deriva SOMENTE da posição do Passo e do vínculo; nunca dos textos (que são apenas rótulos opcionais).
export type BotoesVisiveisPassoTutorial = { voltar: boolean; avancar: boolean; concluir: boolean; fechar: boolean };

export function botoesVisiveisDoPasso(indicePasso: number, totalPassos: number, ehVinculado: boolean = true): BotoesVisiveisPassoTutorial {
    if (totalPassos < 1 || indicePasso < 0) return { voltar: false, avancar: false, concluir: false, fechar: false };
    return { voltar: indicePasso > 0, avancar: indicePasso < totalPassos - 1, concluir: indicePasso === totalPassos - 1 && ehVinculado, fechar: true };
};

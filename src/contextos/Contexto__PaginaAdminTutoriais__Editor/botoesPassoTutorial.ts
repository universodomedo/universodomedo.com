// Etapa 8: regra de navegação do Tutorial — a EXISTÊNCIA de cada botão é derivada SOMENTE da posição do Passo (nunca dos textos, que são apenas rótulos opcionais). Função pura reutilizável pela prévia do editor e pelo futuro renderizador; não depende de estado persistido.
export type BotoesVisiveisPassoTutorial = { voltar: boolean; avancar: boolean; concluir: boolean; fechar: boolean };

export function botoesVisiveisDoPasso(indicePasso: number, totalPassos: number): BotoesVisiveisPassoTutorial {
    if (totalPassos < 1 || indicePasso < 0) return { voltar: false, avancar: false, concluir: false, fechar: false };
    const ehPrimeiro = indicePasso === 0;
    const ehUltimo = indicePasso === totalPassos - 1;
    return { voltar: !ehPrimeiro, avancar: !ehUltimo, concluir: ehUltimo, fechar: true };
};

// Contrato do alvo visual de tutorial (Etapa 13): atributo estável + id do botão da central + seletor de resolução.
// Marcação no JSX usa o mesmo atributo; resolução no hook usa o seletor. Nunca montar seletor com string arbitrária do backend.
export const ATRIBUTO_ALVO_VISUAL_TUTORIAL = 'data-udm-tutorial';
export const ALVO_VISUAL_CENTRAL_BOTAO = 'eventos_usuario.central.botao';

// Seletor estável para resolver o alvo visual no DOM (usado fora do componente de render).
export function seletorAlvoVisualTutorial(alvoVisual: string): string { return `[${ATRIBUTO_ALVO_VISUAL_TUTORIAL}="${alvoVisual}"]`; };

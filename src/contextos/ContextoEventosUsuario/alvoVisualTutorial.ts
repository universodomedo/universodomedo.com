// Contrato do alvo visual de tutorial (Etapa 13): atributo estável + id do botão da central + seletor de resolução.
// Marcação no JSX usa o mesmo atributo; resolução no hook usa o seletor. Nunca montar seletor com string arbitrária do backend.
export const ATRIBUTO_ALVO_VISUAL_TUTORIAL = 'data-udm-tutorial';
export const ALVO_VISUAL_CENTRAL_BOTAO = 'eventos_usuario.central.botao';

// Etapa 16: whitelist de alvos conhecidos. Só um alvo validado aqui pode chegar à resolução de DOM (endurecimento por passo).
const ALVOS_CONHECIDOS: readonly string[] = [ALVO_VISUAL_CENTRAL_BOTAO];
export function alvoVisualConhecido(alvoVisual: string | null): string | null { return alvoVisual && ALVOS_CONHECIDOS.includes(alvoVisual) ? alvoVisual : null; };

// Seletor estável para resolver o alvo visual no DOM (usado fora do componente de render).
export function seletorAlvoVisualTutorial(alvoVisual: string): string { return `[${ATRIBUTO_ALVO_VISUAL_TUTORIAL}="${alvoVisual}"]`; };

import type { BlocoLocalTutorial, PassoLocalTutorial } from './tutorialEditor.types';

// Validação mínima de UX (bloqueia Salvar). Backend continua a fonte da verdade (canvas/sobreposição/HTML/arte existente).
export function passosTutorialSaoValidos(passos: readonly PassoLocalTutorial[]): boolean { return passos.length >= 1 && passos.every(passo => passo.blocos.length > 0 && passo.blocos.every(blocoLocalEhValido)); };

export function blocoLocalEhValido(bloco: BlocoLocalTutorial): boolean { return bloco.tipo === 'texto' ? bloco.markdown.trim().length > 0 : bloco.idImagem !== null; };

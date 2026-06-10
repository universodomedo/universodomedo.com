import type { BlocoLocalTutorial, CampoTextoBotaoTutorial, PassoLocalTutorial, ResultadoAdicionaBlocoTutorial } from './tutorialEditor.types';
import { calculaAreaNovoBloco } from './colisaoTutorial';

export function criaPassoVazioTutorial(idLocal: number): PassoLocalTutorial { return { idLocal, blocos: [] }; };

export function adicionaPassoTutorial(passos: readonly PassoLocalTutorial[], idLocal: number): readonly PassoLocalTutorial[] { return [...passos, criaPassoVazioTutorial(idLocal)]; };

export function removePassoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number): readonly PassoLocalTutorial[] { return passos.length <= 1 ? passos : passos.filter(passo => passo.idLocal !== idLocalPasso); };

export function adicionaBlocoTextoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number): ResultadoAdicionaBlocoTutorial { return adicionaBloco(passos, idLocalPasso, idLocalBloco, 'texto'); };

export function adicionaBlocoImagemTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number): ResultadoAdicionaBlocoTutorial { return adicionaBloco(passos, idLocalPasso, idLocalBloco, 'imagem'); };

export function removeBlocoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number): readonly PassoLocalTutorial[] { return mapaPasso(passos, idLocalPasso, passo => ({ ...passo, blocos: passo.blocos.filter(bloco => bloco.idLocal !== idLocalBloco) })); };

export function atualizaMarkdownBlocoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, markdown: string): readonly PassoLocalTutorial[] { return mapaBloco(passos, idLocalPasso, idLocalBloco, bloco => ({ ...bloco, markdown })); };

export function defineImagemBlocoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, idArquivoTipadoArte: number): readonly PassoLocalTutorial[] { return mapaBloco(passos, idLocalPasso, idLocalBloco, bloco => ({ ...bloco, idArquivoTipadoArte })); };

export function atualizaTextoBotaoPassoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, campo: CampoTextoBotaoTutorial, valor: string): readonly PassoLocalTutorial[] { return mapaPasso(passos, idLocalPasso, passo => ({ ...passo, [campo]: valor })); };

export function mapaPasso(passos: readonly PassoLocalTutorial[], idLocalPasso: number, transforma: (passo: PassoLocalTutorial) => PassoLocalTutorial): readonly PassoLocalTutorial[] { return passos.map(passo => passo.idLocal === idLocalPasso ? transforma(passo) : passo); };

export function mapaBloco(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, transforma: (bloco: BlocoLocalTutorial) => BlocoLocalTutorial): readonly PassoLocalTutorial[] { return mapaPasso(passos, idLocalPasso, passo => ({ ...passo, blocos: passo.blocos.map(bloco => bloco.idLocal === idLocalBloco ? transforma(bloco) : bloco) })); };

function adicionaBloco(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, tipo: 'texto' | 'imagem'): ResultadoAdicionaBlocoTutorial {
    const passo = passos.find(passoAtual => passoAtual.idLocal === idLocalPasso);
    if (!passo) return { ok: false, motivo: 'Passo não encontrado.' };
    const area = calculaAreaNovoBloco(passo.blocos.map(bloco => bloco.area));
    if (!area) return { ok: false, motivo: 'Não há espaço livre neste Passo para um novo bloco com o tamanho padrão.' };
    const novo: BlocoLocalTutorial = { idLocal: idLocalBloco, tipo, markdown: '', idArquivoTipadoArte: null, area };
    return { ok: true, passos: mapaPasso(passos, idLocalPasso, passoAtual => ({ ...passoAtual, blocos: [...passoAtual.blocos, novo] })) };
};

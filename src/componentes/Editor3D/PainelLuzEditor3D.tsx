'use client';

import styles from './Editor3D.module.css';

import type { TipoFonteDeLuzMapa } from 'types-nora-api';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import { ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D, MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D, ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D, TIPOS_FONTE_DE_LUZ_EDITOR3D, type FonteDeLuzEditor3D } from './editor3D.camadaJogo';

export type CampoLuzEditor3D = 'intensidade' | 'alcanceMetros';

interface PainelLuzEditor3DProps {
    readonly luz: FonteDeLuzEditor3D;
    // No Cenário a luz só se POSICIONA (colocar o objeto de iluminação faz parte de construir a sala); tipo, cor,
    // intensidade, alcance, alternável e a fiação são domínio de jogo — editáveis apenas na Coleção de Iluminação.
    readonly edicaoDeJogo: boolean;
    // O outro lado da ARESTA objeto↔luz: os interruptores que acionam ESTA luz (lista derivada dos vínculos).
    readonly interruptores: readonly { readonly idLocal: string; readonly nome: string }[];
    // Modo ARMADO de fiação: "Definir interruptor" liga a espera pelo clique no objeto — só nesse modo o viewport vincula.
    readonly definindoInterruptor: boolean;
    readonly aoMudarTipo: (tipo: TipoFonteDeLuzMapa) => void;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoMudarCampo: (campo: CampoLuzEditor3D, valor: number) => void;
    readonly aoMudarPosicao: (indice: number, valor: number) => void;
    readonly aoAlternarInterruptor: (idComando: string) => void;
    readonly aoAlternarDefinicaoInterruptor: () => void;
};

// Propriedades da Fonte de Luz selecionada. "Alternável" NÃO se autora: é derivado — a luz alterna se, e somente se,
// algum interruptor a aciona; sem interruptor ela é fixa. RENOMEAR e EXCLUIR não moram aqui — seguem a convenção do
// objeto: duplo clique no nome e ícone inline, na árvore da cena.
export function PainelLuzEditor3D({ luz, edicaoDeJogo, interruptores, definindoInterruptor, aoMudarTipo, aoMudarCor, aoMudarCampo, aoMudarPosicao, aoAlternarInterruptor, aoAlternarDefinicaoInterruptor }: PainelLuzEditor3DProps) {
    const ehPonto = luz.tipo === 'PONTO';
    return (
        <div className={styles.painel_objeto}>
            {edicaoDeJogo ? (
                <>
                    <div className={styles.campo_subdivisao}>
                        <span>Tipo</span>
                        <div className={styles.acoes_objeto_painel}>
                            {TIPOS_FONTE_DE_LUZ_EDITOR3D.map(tipo => (
                                <button key={tipo} type="button" className={styles.botao_acao_objeto} disabled={luz.tipo === tipo} onClick={() => aoMudarTipo(tipo)} title={ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D[tipo]}>{tipo === 'PONTO' ? '◉ Ponto' : '◍ Ambiente'}</button>
                            ))}
                        </div>
                        <p className={styles.dica_subdivisao}>{ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D[luz.tipo]}. {ehPonto ? 'Tem posição e projeta sombra — modele o corpo (lâmpada, abajur, LED) como objeto em volta dela.' : 'Banha a cena inteira; não tem posição nem sombra.'}</p>
                    </div>

                    <label className={styles.campo_cor_capa}>
                        <span>Cor</span>
                        <input type="color" value={luz.cor} onChange={evento => aoMudarCor(evento.target.value)} />
                    </label>

                    {/* A fiação nasce AQUI, por ação EXPLÍCITA: "Definir interruptor" arma o modo e só então o clique no
                        objeto do cenário vincula — clique de câmera/seleção nunca cria fiação. Desvincular é pelo ◉.
                        O estado "alternável" é consequência: aparece aqui como leitura, nunca como checkbox. */}
                    <div className={styles.campo_subdivisao}>
                        <span>Interruptores ({interruptores.length})</span>
                        <p className={styles.dica_subdivisao}>{interruptores.length > 0 ? 'Luz alternável em jogo: os interruptores abaixo ligam e desligam o circuito.' : 'Sem interruptor: a luz é fixa, sempre acesa em jogo.'}</p>
                        {interruptores.map(interruptor => (
                            <div key={interruptor.idLocal} className={styles.acoes_objeto_painel}>
                                <button type="button" className={styles.botao_acao_objeto} aria-pressed onClick={() => aoAlternarInterruptor(interruptor.idLocal)} title={`Desvincular ${interruptor.nome} desta luz`}>◉ {interruptor.nome}</button>
                            </div>
                        ))}
                        <div className={styles.acoes_objeto_painel}>
                            <button type="button" className={styles.botao_acao_objeto} aria-pressed={definindoInterruptor} onClick={aoAlternarDefinicaoInterruptor} title={definindoInterruptor ? 'Cancelar a definição de interruptor' : 'Escolher no viewport o objeto que aciona esta luz'}>{definindoInterruptor ? '✕ Cancelar' : '+ Definir interruptor'}</button>
                        </div>
                        {definindoInterruptor && <p className={styles.dica_subdivisao}>Clique no objeto do cenário que aciona esta luz. ESC ou Cancelar sai sem vincular.</p>}
                    </div>

                    <div className={styles.campo_subdivisao}>
                        <span>{ehPonto ? 'Intensidade (%)' : 'Intensidade'}</span>
                        <CampoNumeroEditor3D rotulo="☀" valor={luz.intensidade} passo={ehPonto ? 5 : 0.05} minimo={0} maximo={MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D[luz.tipo]} atualizaValor={valor => aoMudarCampo('intensidade', valor)} />
                        <p className={styles.dica_subdivisao}>{ehPonto ? 'Percentual do alcance: 100% ilumina até o corte; 60% até 60% do caminho — a esfera laranja do esquema.' : 'Escala de ambiente: 0 apaga, 1 é banho pleno.'}</p>
                    </div>

                    {ehPonto && (
                        <div className={styles.campo_subdivisao}>
                            <span>Alcance (m)</span>
                            <CampoNumeroEditor3D rotulo="◎" valor={luz.alcanceMetros} passo={0.5} minimo={0} maximo={ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D} atualizaValor={valor => aoMudarCampo('alcanceMetros', valor)} />
                            <p className={styles.dica_subdivisao}>Tamanho da luz — o corte, a esfera da cor dela no esquema. A intensidade preenche este alcance em percentual: mudar o alcance move as duas esferas juntas.</p>
                        </div>
                    )}
                </>
            ) : (
                <p className={styles.dica_subdivisao}>{ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D[luz.tipo]}. As propriedades de jogo (tipo, cor, intensidade, alcance, interruptor) se editam na Coleção de Iluminação.</p>
            )}

            {ehPonto && (
                <div className={styles.campo_subdivisao}>
                    <span>Posição (m)</span>
                    <CampoNumeroEditor3D rotulo="X" valor={luz.posicao[0]} passo={0.1} atualizaValor={valor => aoMudarPosicao(0, valor)} />
                    <CampoNumeroEditor3D rotulo="Y" valor={luz.posicao[1]} passo={0.1} atualizaValor={valor => aoMudarPosicao(1, valor)} />
                    <CampoNumeroEditor3D rotulo="Z" valor={luz.posicao[2]} passo={0.1} atualizaValor={valor => aoMudarPosicao(2, valor)} />
                    <p className={styles.dica_subdivisao}>Z é a altura (o grid é o chão). Também dá para arrastar a luz pelo gizmo no viewport.</p>
                </div>
            )}
        </div>
    );
};
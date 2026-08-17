'use client';

import styles from './Editor3D.module.css';

import type { CorrenteMapa, TipoFonteDeLuzMapa } from 'types-nora-api';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import { PainelCorrenteEditor3D } from './PainelCorrenteEditor3D';
import { ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D, MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D, ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D, TIPOS_FONTE_DE_LUZ_EDITOR3D, type CircuitoEditor3D, type FonteDeLuzEditor3D } from './editor3D.camadaJogo';

export type CampoLuzEditor3D = 'intensidade' | 'alcanceMetros';

interface PainelLuzEditor3DProps {
    readonly luz: FonteDeLuzEditor3D;
    // No Cenário a luz só se POSICIONA (colocar o objeto de iluminação faz parte de construir a sala); tipo, cor,
    // intensidade, alcance e a fiação são domínio de jogo — editáveis apenas na Coleção de Iluminação.
    readonly edicaoDeJogo: boolean;
    // O CIRCUITO de que esta luz pende (null = alimentação direta) e os interruptores que o alternam.
    readonly circuito: CircuitoEditor3D | null;
    readonly interruptores: readonly { readonly idLocal: string; readonly nome: string }[];
    // Modo ARMADO de fiação: "Definir interruptor" liga a espera pelo clique no objeto — só nesse modo o viewport vincula.
    readonly definindoInterruptor: boolean;
    readonly aoMudarTipo: (tipo: TipoFonteDeLuzMapa) => void;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoMudarCampo: (campo: CampoLuzEditor3D, valor: number) => void;
    readonly aoMudarPosicao: (indice: number, valor: number) => void;
    readonly aoMudarCorrenteEntrega: (corrente: CorrenteMapa) => void;
    readonly aoRemoverInterruptor: (idInterruptor: string) => void;
    readonly aoRemoverDoCircuito: () => void;
    readonly aoAlternarDefinicaoInterruptor: () => void;
};

// Propriedades da Fonte de Luz selecionada. A luz NÃO tem estado aceso/apagado: ela REFLETE a corrente que chega pela
// entrega dela (circuito → entrega). RENOMEAR e EXCLUIR não moram aqui — seguem a convenção do objeto: duplo clique no
// nome e ícone inline, na árvore da cena.
export function PainelLuzEditor3D({ luz, edicaoDeJogo, circuito, interruptores, definindoInterruptor, aoMudarTipo, aoMudarCor, aoMudarCampo, aoMudarPosicao, aoMudarCorrenteEntrega, aoRemoverInterruptor, aoRemoverDoCircuito, aoAlternarDefinicaoInterruptor }: PainelLuzEditor3DProps) {
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
                        objeto do cenário vincula — clique de câmera/seleção nunca cria fiação. O ◉ remove o CORPO do
                        circuito (vale para todas as luzes dele); "Remover do circuito" solta só ESTA luz. */}
                    <div className={styles.campo_subdivisao}>
                        <span>Circuito{circuito !== null ? ` (${interruptores.length} interruptor${interruptores.length === 1 ? '' : 'es'})` : ''}</span>
                        <p className={styles.dica_subdivisao}>{circuito === null ? 'Sem circuito: a luz liga direto na alimentação — sempre energizada em jogo (a corrente da entrega ainda vale).' : interruptores.length > 0 ? 'Luz alternável em jogo: qualquer interruptor abaixo alterna o circuito inteiro.' : 'Circuito sem interruptor: o regime de corrente dele governa as luzes, sem acionamento comum.'}</p>
                        {interruptores.map(interruptor => (
                            <div key={interruptor.idLocal} className={styles.acoes_objeto_painel}>
                                <button type="button" className={styles.botao_acao_objeto} aria-pressed onClick={() => aoRemoverInterruptor(interruptor.idLocal)} title={`Remover ${interruptor.nome} do circuito (vale para todas as luzes dele)`}>◉ {interruptor.nome}</button>
                            </div>
                        ))}
                        <div className={styles.acoes_objeto_painel}>
                            <button type="button" className={styles.botao_acao_objeto} aria-pressed={definindoInterruptor} onClick={aoAlternarDefinicaoInterruptor} title={definindoInterruptor ? 'Cancelar a definição de interruptor' : 'Escolher no viewport o objeto que aciona esta luz'}>{definindoInterruptor ? '✕ Cancelar' : '+ Definir interruptor'}</button>
                            {circuito !== null && <button type="button" className={styles.botao_acao_objeto} onClick={aoRemoverDoCircuito} title="Soltar esta luz do circuito (ela volta a ligar direto na alimentação)">⌀ Remover do circuito</button>}
                        </div>
                        {definindoInterruptor && <p className={styles.dica_subdivisao}>Clique no objeto do cenário que aciona esta luz. ESC ou Cancelar sai sem vincular.</p>}
                    </div>

                    <PainelCorrenteEditor3D titulo="Corrente da entrega" ajuda="A derivação que mora junto DESTA lâmpada: dano ou regime daqui afeta só ela. O viewport anima o resultado ao vivo." corrente={luz.correnteEntrega} aoMudar={aoMudarCorrenteEntrega} />

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
                <p className={styles.dica_subdivisao}>{ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D[luz.tipo]}. As propriedades de jogo (tipo, cor, intensidade, alcance, corrente, circuito) se editam na Coleção de Iluminação.</p>
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
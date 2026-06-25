'use client';

import styles from './styles.module.css';

import { useRef, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useContexto__PaginaGameDesignerMissoesJogaveis } from 'Contextos/Contexto__PaginaGameDesignerMissoesJogaveis/contexto';
import type { ConfiguracaoRuntimeMissaoJogavel, KeySerEmSala, SerEmSala } from 'types-nora-api';

type CondicaoVitoria = ConfiguracaoRuntimeMissaoJogavel['condicaoVitoria'];
type TipoCondicaoVitoria = CondicaoVitoria['tipo'];
type GrupoSeres = 'controlaveis' | 'naoControlaveis';
type SerRegistroSelecao = { readonly id: number; readonly tipoSer: { readonly nome: string; }; };
type DescobertaCondicionada = ConfiguracaoRuntimeMissaoJogavel['descobertasCondicionadas'][number];
type RecompensaDescoberta = DescobertaCondicionada['recompensas'][number];
type CapacidadeInataSelecao = { readonly id: number; readonly nome: string; readonly nomeInteracao: string; };

const ROTULOS_TIPO_CONDICAO_VITORIA: Record<TipoCondicaoVitoria, string> = { qualquer_acao_executada: 'Executar qualquer ação', refem_percebido: 'Perceber um refém (Ser)', inimigo_derrotado: 'Derrotar um não-controlável', tempo_jogo_alcancado: 'Alcançar um marco de tempo' };

const KEY_SER_EM_SALA_VAZIA: KeySerEmSala = 'SER_EM_SALA:';

function criaConfiguracaoVazia(): ConfiguracaoRuntimeMissaoJogavel {
    return { narracaoInicial: '', cenario: { nome: '', mapaLogico: { larguraMetros: 100, alturaMetros: 100 } }, controlaveis: [], naoControlaveis: [], interagiveis: [], descobertasCondicionadas: [], condicaoVitoria: { tipo: 'qualquer_acao_executada' } };
};

function criaCondicaoVitoria(tipo: TipoCondicaoVitoria): CondicaoVitoria {
    if (tipo === 'refem_percebido') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA };
    if (tipo === 'inimigo_derrotado') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA, idEstatisticaDanificavel: 0 };
    if (tipo === 'tempo_jogo_alcancado') return { tipo, tempoAlvoMs: 0 };
    return { tipo: 'qualquer_acao_executada' };
};

function configuracaoEstaPreenchida(config: ConfiguracaoRuntimeMissaoJogavel): boolean {
    if (config.narracaoInicial.trim().length === 0) return false;
    if (config.cenario.nome.trim().length === 0) return false;
    if (config.cenario.mapaLogico.larguraMetros <= 0 || config.cenario.mapaLogico.alturaMetros <= 0) return false;
    if (config.controlaveis.length === 0) return false;
    if ([...config.controlaveis, ...config.naoControlaveis].some(ser => !Number.isInteger(ser.referencia.id) || ser.referencia.id <= 0)) return false;
    return true;
};

function useSeresParaSelecao() {
    return useNoraGraphQLListagem('SerRegistro', {
        select: ['id', { tipoSer: ['id', 'nome'] }],
        itensPorPagina: 100,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BARRA',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useCapacidadesInatas() {
    return useNoraGraphQLListagem('CapacidadeInata', {
        select: ['id', 'nome', 'nomeInteracao'],
        itensPorPagina: 100,
        carregando: 'Buscando Capacidades Inatas',
        mensagemErro: 'Houve um erro recuperando as Capacidades Inatas',
        mensagemListaVazia: 'Nenhuma capacidade inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade inata encontrada com os filtros atuais.',
        carregamento: 'BARRA',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export default function EditorRuntimeMissao() {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();
    const editor = contexto.editorRuntimeMissao;
    const seres = useSeresParaSelecao();
    const capacidades = useCapacidadesInatas();
    const contadorKeysRef = useRef(0);
    const [config, setConfig] = useState<ConfiguracaoRuntimeMissaoJogavel>(() => editor?.configuracaoInicial ?? criaConfiguracaoVazia());

    if (!editor) return null;

    function criaKeySerEmSala(grupo: GrupoSeres): KeySerEmSala {
        contadorKeysRef.current += 1;
        return `SER_EM_SALA:${grupo === 'controlaveis' ? 'CONTROLAVEL' : 'NAO_CONTROLAVEL'}_${contadorKeysRef.current}`;
    };

    function atualizaConfig(parcial: Partial<ConfiguracaoRuntimeMissaoJogavel>): void { setConfig(atual => ({ ...atual, ...parcial })); };
    function atualizaCenario(parcial: Partial<ConfiguracaoRuntimeMissaoJogavel['cenario']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, ...parcial } })); };
    function atualizaMapaLogico(parcial: Partial<ConfiguracaoRuntimeMissaoJogavel['cenario']['mapaLogico']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, mapaLogico: { ...atual.cenario.mapaLogico, ...parcial } } })); };

    function adicionaSerEmSala(grupo: GrupoSeres): void {
        const novo: SerEmSala = { key: criaKeySerEmSala(grupo), referencia: { tipo: 'Ser', id: 0 }, posicaoInicial: { x: 0, y: 0 } };
        setConfig(atual => ({ ...atual, [grupo]: [...atual[grupo], novo] }));
    };
    function removeSerEmSala(grupo: GrupoSeres, key: KeySerEmSala): void { setConfig(atual => ({ ...atual, [grupo]: atual[grupo].filter(ser => ser.key !== key) })); };
    function atualizaSerEmSala(grupo: GrupoSeres, key: KeySerEmSala, parcial: Partial<SerEmSala>): void { setConfig(atual => ({ ...atual, [grupo]: atual[grupo].map(ser => ser.key === key ? { ...ser, ...parcial } : ser) })); };

    function adicionaDescoberta(): void {
        contadorKeysRef.current += 1;
        const nova: DescobertaCondicionada = { key: `DESCOBERTA:${contadorKeysRef.current}`, nome: '', descricaoInterna: '', idCapacidadeInata: 0, recompensas: [] };
        setConfig(atual => ({ ...atual, descobertasCondicionadas: [...atual.descobertasCondicionadas, nova] }));
    };
    function removeDescoberta(key: string): void { setConfig(atual => ({ ...atual, descobertasCondicionadas: atual.descobertasCondicionadas.filter(descoberta => descoberta.key !== key) })); };
    function atualizaDescoberta(key: string, parcial: Partial<DescobertaCondicionada>): void { setConfig(atual => ({ ...atual, descobertasCondicionadas: atual.descobertasCondicionadas.map(descoberta => descoberta.key === key ? { ...descoberta, ...parcial } : descoberta) })); };

    const podeSalvar = configuracaoEstaPreenchida(config) && !contexto.salvando;

    return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}>Configuração Runtime — {editor.nomeMissao}</header>

            <label className={styles.campo}>
                <span>Narração inicial</span>
                <textarea value={config.narracaoInicial} onChange={evento => atualizaConfig({ narracaoInicial: evento.target.value })} rows={3} />
            </label>

            <fieldset className={styles.secao}>
                <legend>Cenário</legend>
                <label className={styles.campo}>
                    <span>Nome do cenário</span>
                    <input type="text" value={config.cenario.nome} onChange={evento => atualizaCenario({ nome: evento.target.value })} />
                </label>
                <div className={styles.linha}>
                    <label className={styles.campo_estreito}>
                        <span>Largura (m)</span>
                        <input type="number" min={1} value={config.cenario.mapaLogico.larguraMetros} onChange={evento => atualizaMapaLogico({ larguraMetros: Number(evento.target.value) })} />
                    </label>
                    <label className={styles.campo_estreito}>
                        <span>Altura (m)</span>
                        <input type="number" min={1} value={config.cenario.mapaLogico.alturaMetros} onChange={evento => atualizaMapaLogico({ alturaMetros: Number(evento.target.value) })} />
                    </label>
                </div>
            </fieldset>

            <ListaSeresEmSala titulo="Controláveis" descricao="Seres que o jogador controla (ao menos um)." grupo="controlaveis" rotuloBotao="controlável" seresEmSala={config.controlaveis} seresDisponiveis={seres.registros} aoAdicionar={adicionaSerEmSala} aoRemover={removeSerEmSala} aoAtualizar={atualizaSerEmSala} />
            <ListaSeresEmSala titulo="Não-controláveis" descricao="NPCs, inimigos e reféns presentes na sala." grupo="naoControlaveis" rotuloBotao="não-controlável" seresEmSala={config.naoControlaveis} seresDisponiveis={seres.registros} aoAdicionar={adicionaSerEmSala} aoRemover={removeSerEmSala} aoAtualizar={atualizaSerEmSala} />

            <SecaoDescobertasCondicionadas descobertas={config.descobertasCondicionadas} capacidades={capacidades.registros} naoControlaveis={config.naoControlaveis} aoAdicionar={adicionaDescoberta} aoRemover={removeDescoberta} aoAtualizar={atualizaDescoberta} />

            <fieldset className={styles.secao}>
                <legend>Condição de vitória</legend>
                <label className={styles.campo}>
                    <span>Tipo</span>
                    <select value={config.condicaoVitoria.tipo} onChange={evento => atualizaConfig({ condicaoVitoria: criaCondicaoVitoria(evento.target.value as TipoCondicaoVitoria) })}>
                        {(Object.keys(ROTULOS_TIPO_CONDICAO_VITORIA) as TipoCondicaoVitoria[]).map(tipo => <option key={tipo} value={tipo}>{ROTULOS_TIPO_CONDICAO_VITORIA[tipo]}</option>)}
                    </select>
                </label>
                <CamposCondicaoVitoria condicaoVitoria={config.condicaoVitoria} naoControlaveis={config.naoControlaveis} aoAtualizar={atualizaConfig} />
            </fieldset>

            <div className={styles.acoes}>
                <button type="button" className={styles.botao_secundario} onClick={contexto.cancelarEditorRuntimeMissao} disabled={contexto.salvando}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void contexto.salvarConfiguracaoRuntimeMissao(config)} disabled={!podeSalvar}>Salvar Runtime</button>
            </div>
        </section>
    );
};

function ListaSeresEmSala({ titulo, descricao, grupo, rotuloBotao, seresEmSala, seresDisponiveis, aoAdicionar, aoRemover, aoAtualizar }: { titulo: string; descricao: string; grupo: GrupoSeres; rotuloBotao: string; seresEmSala: readonly SerEmSala[]; seresDisponiveis: readonly SerRegistroSelecao[]; aoAdicionar: (grupo: GrupoSeres) => void; aoRemover: (grupo: GrupoSeres, key: KeySerEmSala) => void; aoAtualizar: (grupo: GrupoSeres, key: KeySerEmSala, parcial: Partial<SerEmSala>) => void; }) {
    return (
        <fieldset className={styles.secao}>
            <legend>{titulo}</legend>
            <p className={styles.dica}>{descricao}</p>
            {seresEmSala.length === 0 && <p className={styles.vazio}>Nenhum Ser adicionado.</p>}
            {seresEmSala.map(ser => (
                <div key={ser.key} className={styles.item_ser}>
                    <label className={styles.campo}>
                        <span>Ser</span>
                        <select value={ser.referencia.id || ''} onChange={evento => aoAtualizar(grupo, ser.key, { referencia: { tipo: 'Ser', id: Number(evento.target.value) } })}>
                            <option value="">Selecione um Ser…</option>
                            {seresDisponiveis.map(serDisponivel => <option key={serDisponivel.id} value={serDisponivel.id}>Ser #{serDisponivel.id} — {serDisponivel.tipoSer.nome}</option>)}
                        </select>
                    </label>
                    <label className={styles.campo}>
                        <span>Nome em jogo (opcional)</span>
                        <input type="text" value={ser.nomeExibicao ?? ''} onChange={evento => aoAtualizar(grupo, ser.key, { nomeExibicao: evento.target.value.trim().length > 0 ? evento.target.value : undefined })} />
                    </label>
                    <label className={styles.campo_estreito}>
                        <span>Pos. X</span>
                        <input type="number" value={ser.posicaoInicial.x} onChange={evento => aoAtualizar(grupo, ser.key, { posicaoInicial: { x: Number(evento.target.value), y: ser.posicaoInicial.y } })} />
                    </label>
                    <label className={styles.campo_estreito}>
                        <span>Pos. Y</span>
                        <input type="number" value={ser.posicaoInicial.y} onChange={evento => aoAtualizar(grupo, ser.key, { posicaoInicial: { x: ser.posicaoInicial.x, y: Number(evento.target.value) } })} />
                    </label>
                    <button type="button" className={styles.botao_remover} onClick={() => aoRemover(grupo, ser.key)}>Remover</button>
                </div>
            ))}
            <button type="button" className={styles.botao_secundario} onClick={() => aoAdicionar(grupo)}>Adicionar {rotuloBotao}</button>
        </fieldset>
    );
};

function CamposCondicaoVitoria({ condicaoVitoria, naoControlaveis, aoAtualizar }: { condicaoVitoria: CondicaoVitoria; naoControlaveis: readonly SerEmSala[]; aoAtualizar: (parcial: Partial<ConfiguracaoRuntimeMissaoJogavel>) => void; }) {
    if (condicaoVitoria.tipo === 'tempo_jogo_alcancado') {
        return (
            <label className={styles.campo_estreito}>
                <span>Tempo alvo (ms)</span>
                <input type="number" min={1} value={condicaoVitoria.tempoAlvoMs} onChange={evento => aoAtualizar({ condicaoVitoria: { tipo: 'tempo_jogo_alcancado', tempoAlvoMs: Number(evento.target.value) }, temporal: { momentoInicialMs: 0 } })} />
            </label>
        );
    }
    if (condicaoVitoria.tipo === 'refem_percebido') {
        return (
            <label className={styles.campo}>
                <span>Refém (não-controlável a perceber)</span>
                <select value={condicaoVitoria.keySerEmSala} onChange={evento => aoAtualizar({ condicaoVitoria: { tipo: 'refem_percebido', keySerEmSala: evento.target.value as KeySerEmSala } })}>
                    <option value={KEY_SER_EM_SALA_VAZIA}>Selecione…</option>
                    {naoControlaveis.map(ser => <option key={ser.key} value={ser.key}>{ser.nomeExibicao ?? ser.key}</option>)}
                </select>
            </label>
        );
    }
    if (condicaoVitoria.tipo === 'inimigo_derrotado') {
        return (
            <div className={styles.linha}>
                <label className={styles.campo}>
                    <span>Não-controlável alvo</span>
                    <select value={condicaoVitoria.keySerEmSala} onChange={evento => aoAtualizar({ condicaoVitoria: { tipo: 'inimigo_derrotado', keySerEmSala: evento.target.value as KeySerEmSala, idEstatisticaDanificavel: condicaoVitoria.idEstatisticaDanificavel } })}>
                        <option value={KEY_SER_EM_SALA_VAZIA}>Selecione…</option>
                        {naoControlaveis.map(ser => <option key={ser.key} value={ser.key}>{ser.nomeExibicao ?? ser.key}</option>)}
                    </select>
                </label>
                <label className={styles.campo_estreito}>
                    <span>Id estatística danificável</span>
                    <input type="number" min={1} value={condicaoVitoria.idEstatisticaDanificavel} onChange={evento => aoAtualizar({ condicaoVitoria: { tipo: 'inimigo_derrotado', keySerEmSala: condicaoVitoria.keySerEmSala, idEstatisticaDanificavel: Number(evento.target.value) } })} />
                </label>
            </div>
        );
    }
    return <p className={styles.dica}>A missão vence assim que o jogador executa qualquer ação.</p>;
};

function SecaoDescobertasCondicionadas({ descobertas, capacidades, naoControlaveis, aoAdicionar, aoRemover, aoAtualizar }: { descobertas: readonly DescobertaCondicionada[]; capacidades: readonly CapacidadeInataSelecao[]; naoControlaveis: readonly SerEmSala[]; aoAdicionar: () => void; aoRemover: (key: string) => void; aoAtualizar: (key: string, parcial: Partial<DescobertaCondicionada>) => void; }) {
    return (
        <fieldset className={styles.secao}>
            <legend>Descobertas Condicionais</legend>
            <p className={styles.dica}>Uma interação (capacidade) que, ao passar a dificuldade no teste, percebe Seres da sala.</p>
            {descobertas.length === 0 && <p className={styles.vazio}>Nenhuma descoberta adicionada.</p>}
            {descobertas.map(descoberta => (
                <div key={descoberta.key} className={styles.item_descoberta}>
                    <div className={styles.linha}>
                        <label className={styles.campo}>
                            <span>Nome</span>
                            <input type="text" value={descoberta.nome} onChange={evento => aoAtualizar(descoberta.key, { nome: evento.target.value })} />
                        </label>
                        <label className={styles.campo}>
                            <span>Interação (capacidade)</span>
                            <select value={descoberta.idCapacidadeInata || ''} onChange={evento => aoAtualizar(descoberta.key, { idCapacidadeInata: Number(evento.target.value) })}>
                                <option value="">Selecione…</option>
                                {capacidades.map(capacidade => <option key={capacidade.id} value={capacidade.id}>{capacidade.nome} ({capacidade.nomeInteracao})</option>)}
                            </select>
                        </label>
                        <button type="button" className={styles.botao_remover} onClick={() => aoRemover(descoberta.key)}>Remover</button>
                    </div>
                    <label className={styles.campo}>
                        <span>Descrição interna</span>
                        <input type="text" value={descoberta.descricaoInterna} onChange={evento => aoAtualizar(descoberta.key, { descricaoInterna: evento.target.value })} />
                    </label>
                    <RecompensasDescoberta descoberta={descoberta} naoControlaveis={naoControlaveis} aoAtualizar={aoAtualizar} />
                </div>
            ))}
            <button type="button" className={styles.botao_secundario} onClick={aoAdicionar}>Adicionar descoberta</button>
        </fieldset>
    );
};

function RecompensasDescoberta({ descoberta, naoControlaveis, aoAtualizar }: { descoberta: DescobertaCondicionada; naoControlaveis: readonly SerEmSala[]; aoAtualizar: (key: string, parcial: Partial<DescobertaCondicionada>) => void; }) {
    function atualizaRecompensas(recompensas: readonly RecompensaDescoberta[]): void { aoAtualizar(descoberta.key, { recompensas }); };
    function adiciona(): void { atualizaRecompensas([...descoberta.recompensas, { dificuldadeMinima: 0, keysSeresPercebidos: [] }]); };
    function remove(indice: number): void { atualizaRecompensas(descoberta.recompensas.filter((_, indiceAtual) => indiceAtual !== indice)); };
    function atualiza(indice: number, parcial: Partial<RecompensaDescoberta>): void { atualizaRecompensas(descoberta.recompensas.map((recompensa, indiceAtual) => indiceAtual === indice ? { ...recompensa, ...parcial } : recompensa)); };
    function alternaSerPercebido(recompensa: RecompensaDescoberta, indice: number, key: KeySerEmSala, incluir: boolean): void {
        atualiza(indice, { keysSeresPercebidos: incluir ? [...recompensa.keysSeresPercebidos, key] : recompensa.keysSeresPercebidos.filter(keyAtual => keyAtual !== key) });
    };

    return (
        <div className={styles.recompensas}>
            <span className={styles.rotulo_bloco}>Recompensas (o que é percebido ao passar a dificuldade)</span>
            {descoberta.recompensas.length === 0 && <p className={styles.vazio}>Nenhuma recompensa.</p>}
            {descoberta.recompensas.map((recompensa, indice) => (
                <div key={indice} className={styles.item_recompensa}>
                    <label className={styles.campo_estreito}>
                        <span>Dificuldade ≥</span>
                        <input type="number" min={0} value={recompensa.dificuldadeMinima} onChange={evento => atualiza(indice, { dificuldadeMinima: Number(evento.target.value) })} />
                    </label>
                    <div className={styles.campo}>
                        <span>Percebe os Seres</span>
                        {naoControlaveis.length === 0 ? <span className={styles.vazio}>Adicione não-controláveis primeiro.</span> : (
                            <div className={styles.checkboxes}>
                                {naoControlaveis.map(ser => (
                                    <label key={ser.key} className={styles.checkbox}>
                                        <input type="checkbox" checked={recompensa.keysSeresPercebidos.includes(ser.key)} onChange={evento => alternaSerPercebido(recompensa, indice, ser.key, evento.target.checked)} />
                                        {ser.nomeExibicao ?? ser.key}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="button" className={styles.botao_remover} onClick={() => remove(indice)}>Remover</button>
                </div>
            ))}
            <button type="button" className={styles.botao_secundario} onClick={adiciona}>Adicionar recompensa</button>
        </div>
    );
};

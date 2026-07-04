'use client';

import styles from './styles.module.css';

import type { ConfiguracaoPartida, KeySerEmSala, SerEmSala } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import { KEY_SER_EM_SALA_VAZIA, ROTULOS_TIPO_CONDICAO_VITORIA, rotuloSer, type CondicaoVitoria, type TipoCondicaoVitoria } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { SecaoSeresEmSala } from './SecaoSeresEmSala';
import { SecaoObjetos } from './SecaoObjetos';
import { SecaoDescobertas } from './SecaoDescobertas';

const OPCOES_TIPO_CONDICAO_VITORIA = (Object.keys(ROTULOS_TIPO_CONDICAO_VITORIA) as TipoCondicaoVitoria[]).map(tipo => ({ value: tipo, label: ROTULOS_TIPO_CONDICAO_VITORIA[tipo] }));

// Subfluxo Formulário (vista principal do Runtime). O config, os helpers e o mapa de nomes dos Seres vêm do Controlador de Fluxo (contexto do Editor); este SPA só renderiza.
// As grades (Controláveis / Não-controláveis / Objetos / Descobertas) disparam ações de fluxo — o resolveSaida decide seleção/config em vistas próprias.
export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor() {
    const editor = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const config = editor.config;
    const nomesPorIdSer = editor.nomesPorIdSer;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <section className={styles.editor}>
                    <label className={styles.campo}>
                        <span>Narração inicial</span>
                        <textarea value={config.narracaoInicial} onChange={evento => editor.atualizaConfig({ narracaoInicial: evento.target.value })} rows={3} />
                    </label>

                    <fieldset className={styles.secao}>
                        <legend>Cenário</legend>
                        <label className={styles.campo}>
                            <span>Nome do cenário</span>
                            <input type="text" value={config.cenario.nome} onChange={evento => editor.atualizaCenario({ nome: evento.target.value })} />
                        </label>
                        <div className={styles.linha}>
                            <label className={styles.campo_estreito}>
                                <span>Largura (m)</span>
                                <input type="number" min={1} value={config.cenario.mapaLogico.larguraMetros} onChange={evento => editor.atualizaMapaLogico({ larguraMetros: Number(evento.target.value) })} />
                            </label>
                            <label className={styles.campo_estreito}>
                                <span>Altura (m)</span>
                                <input type="number" min={1} value={config.cenario.mapaLogico.alturaMetros} onChange={evento => editor.atualizaMapaLogico({ alturaMetros: Number(evento.target.value) })} />
                            </label>
                        </div>
                    </fieldset>

                    <SecaoSeresEmSala titulo="Controláveis" seres={config.controlaveis} nomesPorIdSer={nomesPorIdSer} aoAdicionar={() => editor.irParaSelecaoSer('controlaveis')} aoEditar={key => editor.irParaConfigSer('controlaveis', key)} aoRemover={key => editor.removeSerEmSala('controlaveis', key)} />

                    <SecaoSeresEmSala titulo="Não-controláveis" seres={config.naoControlaveis} nomesPorIdSer={nomesPorIdSer} aoAdicionar={() => editor.irParaSelecaoSer('naoControlaveis')} aoEditar={key => editor.irParaConfigSer('naoControlaveis', key)} aoRemover={key => editor.removeSerEmSala('naoControlaveis', key)} />

                    <SecaoObjetos objetos={config.interagiveis} aoAdicionar={editor.adicionaEConfiguraObjeto} aoEditar={key => editor.irParaConfigObjeto(key)} aoRemover={editor.removeObjeto} />

                    <SecaoDescobertas descobertas={config.descobertasCondicionadas} aoAdicionar={editor.adicionaEConfiguraDescoberta} aoEditar={key => editor.irParaConfigDescoberta(key)} aoRemover={editor.removeDescoberta} />

                    <fieldset className={styles.secao}>
                        <legend>Condição de vitória</legend>
                        <InputComRotulo rotulo="Tipo">
                            <SelecionadorOpcoes opcoes={OPCOES_TIPO_CONDICAO_VITORIA} valor={config.condicaoVitoria.tipo} onChange={valor => { if (valor) editor.selecionaTipoCondicaoVitoria(valor as TipoCondicaoVitoria); }} isClearable={false} />
                        </InputComRotulo>
                        <CamposCondicaoVitoria condicaoVitoria={config.condicaoVitoria} naoControlaveis={config.naoControlaveis} nomesPorIdSer={nomesPorIdSer} aoAtualizar={editor.atualizaConfig} />
                    </fieldset>
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void editor.salvarConfiguracao()} disabled={!editor.podeSalvar}>Salvar Configuração</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

function CamposCondicaoVitoria({ condicaoVitoria, naoControlaveis, nomesPorIdSer, aoAtualizar }: { condicaoVitoria: CondicaoVitoria; naoControlaveis: readonly SerEmSala[]; nomesPorIdSer: Record<number, string>; aoAtualizar: (parcial: Partial<ConfiguracaoPartida>) => void; }) {
    const opcoesNaoControlaveis = naoControlaveis.map(ser => ({ value: ser.key, label: rotuloSer(ser, nomesPorIdSer) }));
    const valorSerEmSala = (keySerEmSala: KeySerEmSala): string | null => keySerEmSala === KEY_SER_EM_SALA_VAZIA ? null : keySerEmSala;

    if (condicaoVitoria.tipo === 'tempo_jogo_alcancado') {
        return (
            <InputComRotulo rotulo="Tempo alvo (ms)">
                <InputNumerico value={condicaoVitoria.tempoAlvoMs} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'tempo_jogo_alcancado', tempoAlvoMs: valor } })} />
            </InputComRotulo>
        );
    }
    if (condicaoVitoria.tipo === 'refem_percebido') {
        return (
            <InputComRotulo rotulo="Refém (não-controlável a perceber)">
                <SelecionadorOpcoes opcoes={opcoesNaoControlaveis} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'refem_percebido', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala } })} placeholder="Selecione…" isClearable={false} />
            </InputComRotulo>
        );
    }
    if (condicaoVitoria.tipo === 'inimigo_derrotado') {
        return (
            <div className={styles.linha}>
                <InputComRotulo rotulo="Não-controlável alvo">
                    <SelecionadorOpcoes opcoes={opcoesNaoControlaveis} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'inimigo_derrotado', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala, idEstatisticaDanificavel: condicaoVitoria.idEstatisticaDanificavel } })} placeholder="Selecione…" isClearable={false} />
                </InputComRotulo>
                <InputComRotulo rotulo="Id estatística danificável">
                    <InputNumerico value={condicaoVitoria.idEstatisticaDanificavel} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'inimigo_derrotado', keySerEmSala: condicaoVitoria.keySerEmSala, idEstatisticaDanificavel: valor } })} />
                </InputComRotulo>
            </div>
        );
    }
    if (condicaoVitoria.tipo === 'proximidade_ser_alcancada') {
        return (
            <div className={styles.linha}>
                <InputComRotulo rotulo="Ser a alcançar (não-controlável)">
                    <SelecionadorOpcoes opcoes={opcoesNaoControlaveis} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'proximidade_ser_alcancada', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala, distanciaMaximaMetros: condicaoVitoria.distanciaMaximaMetros } })} placeholder="Selecione…" isClearable={false} />
                </InputComRotulo>
                <InputComRotulo rotulo="Distância máx. (m)">
                    <InputNumerico value={condicaoVitoria.distanciaMaximaMetros} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'proximidade_ser_alcancada', keySerEmSala: condicaoVitoria.keySerEmSala, distanciaMaximaMetros: valor } })} />
                </InputComRotulo>
            </div>
        );
    }
    return <p className={styles.dica}>A Partida vence assim que o jogador executa qualquer ação.</p>;
};

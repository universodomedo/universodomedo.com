'use client';

import styles from './styles.module.css';

import type { ConfiguracaoPartida, KeySerEmSala } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import { KEY_SER_EM_SALA_VAZIA, PAREDES_MAPA, ROTULOS_TIPO_CONDICAO_VITORIA, geometriaPortaDaParede, keySerEmSalaDaChave, luzesDaConfig, objetosDaConfig, paredeDaPorta, portasDaConfig, rotuloObjeto, rotuloSer, seresDoGrupo, type CondicaoVitoria, type InteragivelObjeto, type InteragivelSer, type ParedeMapa, type Porta, type TipoCondicaoVitoria } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { SecaoSeresEmSala } from './SecaoSeresEmSala';
import { SecaoObjetos } from './SecaoObjetos';
import { SecaoLuzes } from './SecaoLuzes';

const OPCOES_TIPO_CONDICAO_VITORIA = (Object.keys(ROTULOS_TIPO_CONDICAO_VITORIA) as TipoCondicaoVitoria[]).map(tipo => ({ value: tipo, label: ROTULOS_TIPO_CONDICAO_VITORIA[tipo] }));

// Subfluxo Formulário (vista principal do Runtime). O config, os helpers e o mapa de nomes dos Seres vêm do Controlador de Fluxo (contexto do Editor); este SPA só renderiza.
// As grades (Seres de Jogadores / Seres do Sistema / Objetos) são filtros do interagiveis unificado por controlador/tipo. Descobertas moram dentro de cada Interagível (config próprio).
export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor() {
    const editor = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const config = editor.config;
    const nomesPorIdSer = editor.nomesPorIdSer;
    const seresSistema = seresDoGrupo(config, 'sistema');

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
                                <span>Largura (mm)</span>
                                <input type="number" min={1} value={config.cenario.mapaLogico.larguraMilimetros} onChange={evento => editor.atualizaMapaLogico({ larguraMilimetros: Number(evento.target.value) })} />
                            </label>
                            <label className={styles.campo_estreito}>
                                <span>Altura (mm)</span>
                                <input type="number" min={1} value={config.cenario.mapaLogico.alturaMilimetros} onChange={evento => editor.atualizaMapaLogico({ alturaMilimetros: Number(evento.target.value) })} />
                            </label>
                        </div>
                    </fieldset>

                    <SecaoPortasMapa portas={portasDaConfig(config)} mapaLargura={config.cenario.mapaLogico.larguraMilimetros} mapaAltura={config.cenario.mapaLogico.alturaMilimetros} aoAtualizar={portas => editor.atualizaMapaLogico({ portas })} />

                    <SecaoSeresEmSala titulo="Seres de Jogadores" seres={seresDoGrupo(config, 'jogador')} nomesPorIdSer={nomesPorIdSer} aoAdicionar={() => editor.irParaSelecaoSer('jogador')} aoEditar={chave => editor.irParaConfigSer(chave)} aoRemover={chave => editor.removeInteragivel(chave)} />

                    <SecaoSeresEmSala titulo="Seres do Sistema" seres={seresSistema} nomesPorIdSer={nomesPorIdSer} aoAdicionar={() => editor.irParaSelecaoSer('sistema')} aoEditar={chave => editor.irParaConfigSer(chave)} aoRemover={chave => editor.removeInteragivel(chave)} />

                    <SecaoObjetos objetos={objetosDaConfig(config)} aoAdicionar={editor.adicionaEConfiguraObjeto} aoEditar={chave => editor.irParaConfigObjeto(chave)} aoRemover={chave => editor.removeInteragivel(chave)} />

                    <SecaoLuzes luzes={luzesDaConfig(config)} aoAdicionar={editor.adicionaEConfiguraLuz} aoEditar={chave => editor.irParaConfigLuz(chave)} aoRemover={chave => editor.removeLuz(chave)} />

                    <fieldset className={styles.secao}>
                        <legend>Condição de vitória</legend>
                        <InputComRotulo rotulo="Tipo">
                            <SelecionadorOpcoes opcoes={OPCOES_TIPO_CONDICAO_VITORIA} valor={config.condicaoVitoria.tipo} onChange={valor => { if (valor) editor.selecionaTipoCondicaoVitoria(valor as TipoCondicaoVitoria); }} isClearable={false} />
                        </InputComRotulo>
                        <CamposCondicaoVitoria condicaoVitoria={config.condicaoVitoria} seresSistema={seresSistema} objetos={objetosDaConfig(config)} nomesPorIdSer={nomesPorIdSer} aoAtualizar={editor.atualizaConfig} />
                    </fieldset>
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void editor.salvarConfiguracao()} disabled={!editor.podeSalvar}>Salvar Configuração</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

// Autoria mínima das Portas do Mapa (estrutura): parede N/S/L/O + deslocamento => geometria (posicao/orientacao). O Editor 3D depois autora a mesma geometria. Guardado em cenario.mapaLogico.portas.
function SecaoPortasMapa({ portas, mapaLargura, mapaAltura, aoAtualizar }: { portas: readonly Porta[]; mapaLargura: number; mapaAltura: number; aoAtualizar: (portas: readonly Porta[]) => void; }) {
    function adicionar(): void {
        const geometria = geometriaPortaDaParede('norte', 1000, mapaLargura, mapaAltura);
        aoAtualizar([...portas, { chave: `porta_${crypto.randomUUID()}`, nome: `Porta ${portas.length + 1}`, posicao: geometria.posicao, orientacaoGraus: geometria.orientacaoGraus, larguraMilimetros: 1200, alturaMilimetros: 2200 }]);
    };
    function atualiza(indice: number, porta: Porta): void { aoAtualizar(portas.map((atual, i) => i === indice ? porta : atual)); };
    function remove(indice: number): void { aoAtualizar(portas.filter((_, i) => i !== indice)); };

    return (
        <fieldset className={styles.secao}>
            <legend>Portas do Mapa</legend>
            {portas.map((porta, indice) => <LinhaPortaMapa key={porta.chave} porta={porta} mapaLargura={mapaLargura} mapaAltura={mapaAltura} aoAtualizar={atualizada => atualiza(indice, atualizada)} aoRemover={() => remove(indice)} />)}
            <button type="button" onClick={adicionar}>+ Porta</button>
        </fieldset>
    );
};

function LinhaPortaMapa({ porta, mapaLargura, mapaAltura, aoAtualizar, aoRemover }: { porta: Porta; mapaLargura: number; mapaAltura: number; aoAtualizar: (porta: Porta) => void; aoRemover: () => void; }) {
    const paredeDeslocamento = paredeDaPorta(porta, mapaAltura);
    function aplicaParedeDeslocamento(parede: ParedeMapa, deslocamento: number): void {
        const geometria = geometriaPortaDaParede(parede, deslocamento, mapaLargura, mapaAltura);
        aoAtualizar({ ...porta, posicao: geometria.posicao, orientacaoGraus: geometria.orientacaoGraus });
    };
    return (
        <div className={styles.linha}>
            <InputComRotulo rotulo="Nome">
                <input type="text" value={porta.nome} onChange={evento => aoAtualizar({ ...porta, nome: evento.target.value })} />
            </InputComRotulo>
            <InputComRotulo rotulo="Parede">
                <SelecionadorOpcoes opcoes={PAREDES_MAPA.map(parede => ({ value: parede.value, label: parede.label }))} valor={paredeDeslocamento.parede} onChange={valor => { if (valor) aplicaParedeDeslocamento(valor as ParedeMapa, paredeDeslocamento.deslocamento); }} isClearable={false} />
            </InputComRotulo>
            <InputComRotulo rotulo="Deslocamento (mm)">
                <InputNumerico value={paredeDeslocamento.deslocamento} onChange={valor => aplicaParedeDeslocamento(paredeDeslocamento.parede, valor)} />
            </InputComRotulo>
            <InputComRotulo rotulo="Largura (mm)">
                <InputNumerico value={porta.larguraMilimetros} onChange={valor => aoAtualizar({ ...porta, larguraMilimetros: valor })} />
            </InputComRotulo>
            <InputComRotulo rotulo="Altura (mm)">
                <InputNumerico value={porta.alturaMilimetros} onChange={valor => aoAtualizar({ ...porta, alturaMilimetros: valor })} />
            </InputComRotulo>
            <button type="button" data-variante="perigo" onClick={aoRemover}>Remover</button>
        </div>
    );
};

function CamposCondicaoVitoria({ condicaoVitoria, seresSistema, objetos, nomesPorIdSer, aoAtualizar }: { condicaoVitoria: CondicaoVitoria; seresSistema: readonly InteragivelSer[]; objetos: readonly InteragivelObjeto[]; nomesPorIdSer: Record<number, string>; aoAtualizar: (parcial: Partial<ConfiguracaoPartida>) => void; }) {
    const opcoesSeres = seresSistema.map(ser => ({ value: keySerEmSalaDaChave(ser.chave) as string, label: rotuloSer(ser, nomesPorIdSer) }));
    const opcoesObjetos = objetos.map(objeto => ({ value: objeto.chave, label: rotuloObjeto(objeto) }));
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
            <InputComRotulo rotulo="Refém (Ser do Sistema a perceber)">
                <SelecionadorOpcoes opcoes={opcoesSeres} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'refem_percebido', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala } })} placeholder="Selecione…" isClearable={false} />
            </InputComRotulo>
        );
    }
    if (condicaoVitoria.tipo === 'inimigo_derrotado') {
        return (
            <div className={styles.linha}>
                <InputComRotulo rotulo="Ser do Sistema alvo">
                    <SelecionadorOpcoes opcoes={opcoesSeres} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'inimigo_derrotado', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala, idEstatisticaDanificavel: condicaoVitoria.idEstatisticaDanificavel } })} placeholder="Selecione…" isClearable={false} />
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
                <InputComRotulo rotulo="Ser a alcançar (do Sistema)">
                    <SelecionadorOpcoes opcoes={opcoesSeres} valor={valorSerEmSala(condicaoVitoria.keySerEmSala)} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'proximidade_ser_alcancada', keySerEmSala: (valor ?? KEY_SER_EM_SALA_VAZIA) as KeySerEmSala, distanciaMaximaMilimetros: condicaoVitoria.distanciaMaximaMilimetros } })} placeholder="Selecione…" isClearable={false} />
                </InputComRotulo>
                <InputComRotulo rotulo="Distância máx. (m)">
                    <InputNumerico value={condicaoVitoria.distanciaMaximaMilimetros} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'proximidade_ser_alcancada', keySerEmSala: condicaoVitoria.keySerEmSala, distanciaMaximaMilimetros: valor } })} />
                </InputComRotulo>
            </div>
        );
    }
    if (condicaoVitoria.tipo === 'saida_pela_porta') {
        return (
            <div className={styles.linha}>
                <InputComRotulo rotulo="Porta (objeto de saída)">
                    <SelecionadorOpcoes opcoes={opcoesObjetos} valor={condicaoVitoria.keyInteragivel || null} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'saida_pela_porta', keyInteragivel: valor ?? '', distanciaMaximaMilimetros: condicaoVitoria.distanciaMaximaMilimetros } })} placeholder="Selecione…" isClearable={false} />
                </InputComRotulo>
                <InputComRotulo rotulo="Distância máx. (mm)">
                    <InputNumerico value={condicaoVitoria.distanciaMaximaMilimetros} onChange={valor => aoAtualizar({ condicaoVitoria: { tipo: 'saida_pela_porta', keyInteragivel: condicaoVitoria.keyInteragivel, distanciaMaximaMilimetros: valor } })} />
                </InputComRotulo>
            </div>
        );
    }
    return <p className={styles.dica}>A Partida vence assim que o jogador executa qualquer ação.</p>;
};

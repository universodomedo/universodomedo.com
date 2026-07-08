import { useState } from 'react';

import styles from './styles.module.css';

import type { ModoRequisitoAcesso, RequisitoAcessoResumo, TipoPartida, TipoRequisitoAcesso } from 'types-nora-api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { Componente_Selecionador__Capacidade } from 'Componentes/Selecionadores/Componente_Selecionador__Capacidade/Componente_Selecionador__Capacidade';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaGameDesignerCatalogosPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Edicao/contexto';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };

// Rotulos de UI para os contratos de requisito (chaves tipadas pelos tipos compartilhados: novo valor no contrato quebra o build aqui, de proposito).
const ROTULOS_MODO_REQUISITO: Record<ModoRequisitoAcesso, string> = { OCULTAR: 'Oculta sem', BLOQUEAR: 'Bloqueia sem', MASCARAR: 'Mascara ("???") sem' };
const OPCOES_TIPO_REQUISITO: readonly { value: TipoRequisitoAcesso; label: string }[] = [{ value: 'CAPACIDADE', label: 'Capacidade' }, { value: 'COMPRA', label: 'Compra (integração pendente)' }, { value: 'DESBLOQUEIO', label: 'Desbloqueio (integração pendente)' }];
const OPCOES_MODO_REQUISITO: readonly { value: ModoRequisitoAcesso; label: string }[] = [{ value: 'OCULTAR', label: 'Ocultar' }, { value: 'BLOQUEAR', label: 'Bloquear (cadeado)' }, { value: 'MASCARAR', label: 'Mascarar ("???")' }];
const ALVO_CATALOGO = 'catalogo';

function rotuloRequisito(requisito: RequisitoAcessoResumo): string {
    if (requisito.tipo === 'CAPACIDADE') return requisito.capacidade.path;
    if (requisito.tipo === 'COMPRA') return 'Compra do conteúdo';
    return 'Desbloqueio por progressão';
};

export default function SPA__PaginaGameDesignerCatalogosPartida__Edicao() {
    const { catalogo, partidasNoCatalogo, partidasDisponiveis, salvando, nome, setNome, podeSalvarNome, salvarNome, alternarAtivoCatalogo, deletar, adicionarPartidaAoCatalogo, removerPartidaDoCatalogo, alternarExibicaoPartida, reordenarPartidasDoCatalogo, requisitosAcesso, adicionarRequisitoAoCatalogo, removerRequisitoAcessoDoCatalogo, adicionarRequisitoAoSubcatalogo, removerRequisitoDoSubcatalogo, subcatalogos, criarSubcatalogoNoCatalogo, alternarAtivoSubcatalogo, deletarSubcatalogoDoCatalogo, definirSubcatalogoDaPartida } = useContexto__PaginaGameDesignerCatalogosPartida__Edicao();
    const [arrastandoId, setArrastandoId] = useState<number | null>(null);
    const [idParaAdicionar, setIdParaAdicionar] = useState<string>('');
    const [selecionandoCapacidade, setSelecionandoCapacidade] = useState(false);
    const [nomeNovoSubcatalogo, setNomeNovoSubcatalogo] = useState('');
    const [alvoRequisito, setAlvoRequisito] = useState<string>(ALVO_CATALOGO);
    const [tipoRequisito, setTipoRequisito] = useState<TipoRequisitoAcesso>('CAPACIDADE');
    const [modoRequisito, setModoRequisito] = useState<ModoRequisitoAcesso>('OCULTAR');
    const ehCatalogoDesafios = catalogo.tipo === 'DESAFIOS';
    const opcoesSubcatalogo = subcatalogos.map(subcatalogo => ({ value: String(subcatalogo.id), label: subcatalogo.nome }));
    const opcoesAlvoRequisito = [{ value: ALVO_CATALOGO, label: 'Catálogo inteiro' }, ...subcatalogos.map(subcatalogo => ({ value: String(subcatalogo.id), label: `SubCatálogo: ${subcatalogo.nome}` }))];
    const temRequisitos = requisitosAcesso.length > 0 || subcatalogos.some(subcatalogo => subcatalogo.requisitosAcesso.length > 0);

    async function adicionarRequisito(idCapacidade?: number): Promise<void> {
        if (alvoRequisito === ALVO_CATALOGO) await adicionarRequisitoAoCatalogo(tipoRequisito, modoRequisito, idCapacidade);
        else await adicionarRequisitoAoSubcatalogo(Number(alvoRequisito), tipoRequisito, modoRequisito, idCapacidade);
        setSelecionandoCapacidade(false);
    };

    async function criarSubcatalogo(): Promise<void> {
        const nomeNormalizado = nomeNovoSubcatalogo.trim();
        if (nomeNormalizado.length === 0) return;
        setNomeNovoSubcatalogo('');
        await criarSubcatalogoNoCatalogo(nomeNormalizado);
    };

    function aoSoltarSobre(idAlvo: number): void {
        const origem = arrastandoId;
        setArrastandoId(null);
        if (origem === null || origem === idAlvo) return;

        const ids = partidasNoCatalogo.map(partida => partida.idPartida);
        const para = ids.indexOf(idAlvo);
        if (!ids.includes(origem) || para < 0) return;

        const novaOrdem = ids.filter(id => id !== origem);
        novaOrdem.splice(para, 0, origem);
        void reordenarPartidasDoCatalogo(novaOrdem);
    };

    function adicionar(): void {
        if (idParaAdicionar === '') return;
        const id = Number(idParaAdicionar);
        setIdParaAdicionar('');
        void adicionarPartidaAoCatalogo(id);
    };

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <section className={styles.edicao}>
                    <label className={styles.campo}>
                        <span>Nome do Catálogo</span>
                        <div className={styles.linha}>
                            <input type="text" value={nome} onChange={evento => setNome(evento.target.value)} maxLength={120} disabled={salvando} />
                            <button type="button" className={styles.botao_salvar} onClick={() => void salvarNome()} disabled={!podeSalvarNome || salvando}>Salvar nome</button>
                        </div>
                    </label>

                    <label className={styles.toggle}>
                        <input type="checkbox" checked={catalogo.ativo} onChange={evento => void alternarAtivoCatalogo(evento.target.checked)} disabled={salvando} />
                        Catálogo ativo (o grupo aparece no Orbital)
                    </label>

                    <div className={styles.bloco}>
                        <h3 className={styles.titulo}>Partidas neste catálogo</h3>
                        {partidasNoCatalogo.length === 0
                            ? <p className={styles.vazio}>Nenhuma Partida neste catálogo. Adicione uma abaixo.</p>
                            : (
                                <div className={styles.lista}>
                                    {partidasNoCatalogo.map(partida => (
                                        <div
                                            key={partida.idPartida}
                                            className={`${styles.item} ${arrastandoId === partida.idPartida ? styles.item_arrastando : ''}`}
                                            draggable
                                            onDragStart={() => setArrastandoId(partida.idPartida)}
                                            onDragOver={evento => evento.preventDefault()}
                                            onDrop={() => aoSoltarSobre(partida.idPartida)}
                                            onDragEnd={() => setArrastandoId(null)}
                                        >
                                            <span className={styles.alca} aria-hidden="true" title="Arraste para reordenar">⠿</span>
                                            <strong className={styles.nome}>{partida.nome}</strong>
                                            <span className={styles.selo}>{ROTULOS_TIPO_PARTIDA[partida.tipo]}{partida.tipoDesafio ? ` · ${partida.tipoDesafio}` : ''}</span>
                                            {!partida.partidaConfigurada && <span className={styles.selo_pendente}>Sem configuração</span>}
                                            {!ehCatalogoDesafios && subcatalogos.length > 0 && (
                                                <div className={styles.seletor_subcatalogo}>
                                                    <SelecionadorOpcoes opcoes={opcoesSubcatalogo} valor={partida.idSubcatalogo === null ? null : String(partida.idSubcatalogo)} onChange={valor => void definirSubcatalogoDaPartida(partida.idPartida, valor === null ? null : Number(valor))} placeholder="Sem subcatálogo" isClearable disabled={salvando} />
                                                </div>
                                            )}
                                            <label className={styles.toggle_exibicao}>
                                                <input type="checkbox" checked={partida.ativo} onChange={evento => void alternarExibicaoPartida(partida.idPartida, evento.target.checked)} disabled={salvando} />
                                                Exibir
                                            </label>
                                            <button type="button" className={styles.botao_remover} onClick={() => void removerPartidaDoCatalogo(partida.idPartida)} disabled={salvando} title="Remover do catálogo">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        <div className={styles.adicionar}>
                            <select value={idParaAdicionar} onChange={evento => setIdParaAdicionar(evento.target.value)} disabled={salvando || partidasDisponiveis.length === 0}>
                                <option value="">{partidasDisponiveis.length === 0 ? 'Nenhuma Partida disponível' : 'Selecione uma Partida…'}</option>
                                {partidasDisponiveis.map(partida => <option key={partida.id} value={partida.id}>{partida.nome} ({ROTULOS_TIPO_PARTIDA[partida.tipo]})</option>)}
                            </select>
                            <button type="button" className={styles.botao_adicionar} onClick={adicionar} disabled={salvando || idParaAdicionar === ''}>Adicionar Partida</button>
                        </div>
                    </div>

                    {!ehCatalogoDesafios && (
                        <div className={styles.bloco}>
                            <h3 className={styles.titulo}>SubCatálogos</h3>
                            {subcatalogos.length === 0
                                ? <p className={styles.vazio}>Nenhum subcatálogo: as Partidas ficam soltas no catálogo.</p>
                                : (
                                    <div className={styles.lista}>
                                        {subcatalogos.map(subcatalogo => (
                                            <div key={subcatalogo.id} className={styles.item}>
                                                <strong className={styles.nome}>{subcatalogo.nome}</strong>
                                                <span className={styles.selo}>{catalogo.partidas.filter(partida => partida.idSubcatalogo === subcatalogo.id).length} Partida(s)</span>
                                                <div className={styles.toggle_subcatalogo}>
                                                    <AlternaOpcao opcao={subcatalogo.ativo} onChange={ativo => void alternarAtivoSubcatalogo(subcatalogo, ativo)} desabilitado={salvando} />
                                                </div>
                                                <button type="button" className={styles.botao_remover} onClick={() => void deletarSubcatalogoDoCatalogo(subcatalogo.id)} disabled={salvando} title="Deletar subcatálogo (as Partidas voltam a ficar soltas)">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            <div className={styles.adicionar}>
                                <InputComRotulo rotulo="Novo SubCatálogo" classname={styles.campo_novo_subcatalogo}>
                                    <input type="text" value={nomeNovoSubcatalogo} onChange={evento => setNomeNovoSubcatalogo(evento.target.value)} maxLength={120} disabled={salvando} />
                                </InputComRotulo>
                                <button type="button" className={styles.botao_adicionar} onClick={() => void criarSubcatalogo()} disabled={salvando || nomeNovoSubcatalogo.trim().length === 0}>Criar SubCatálogo</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.bloco}>
                        <h3 className={styles.titulo}>Requisitos de acesso no Orbital</h3>
                        {!temRequisitos
                            ? <p className={styles.vazio}>Nenhum requisito: catálogo e subcatálogos aparecem para todos os jogadores.</p>
                            : (
                                <div className={styles.lista}>
                                    {requisitosAcesso.map(requisito => (
                                        <div key={`catalogo-${requisito.id}`} className={styles.item}>
                                            <span className={styles.selo}>{ROTULOS_MODO_REQUISITO[requisito.modo]}</span>
                                            <strong className={styles.nome}>{rotuloRequisito(requisito)}</strong>
                                            <button type="button" className={styles.botao_remover} onClick={() => void removerRequisitoAcessoDoCatalogo(requisito.id)} disabled={salvando} title="Remover requisito">×</button>
                                        </div>
                                    ))}
                                    {subcatalogos.flatMap(subcatalogo => subcatalogo.requisitosAcesso.map(requisito => (
                                        <div key={`subcatalogo-${subcatalogo.id}-${requisito.id}`} className={styles.item}>
                                            <span className={styles.selo}>{subcatalogo.nome}</span>
                                            <span className={styles.selo}>{ROTULOS_MODO_REQUISITO[requisito.modo]}</span>
                                            <strong className={styles.nome}>{rotuloRequisito(requisito)}</strong>
                                            <button type="button" className={styles.botao_remover} onClick={() => void removerRequisitoDoSubcatalogo(subcatalogo.id, requisito.id)} disabled={salvando} title="Remover requisito">×</button>
                                        </div>
                                    )))}
                                </div>
                            )}

                        <div className={styles.definicao_requisito}>
                            <div className={styles.campo_definicao}><SelecionadorOpcoes opcoes={opcoesAlvoRequisito} valor={alvoRequisito} onChange={valor => setAlvoRequisito(valor ?? ALVO_CATALOGO)} placeholder="Alvo" disabled={salvando} /></div>
                            <div className={styles.campo_definicao}><SelecionadorOpcoes opcoes={OPCOES_TIPO_REQUISITO.map(opcao => ({ value: opcao.value, label: opcao.label }))} valor={tipoRequisito} onChange={valor => { setTipoRequisito((valor ?? 'CAPACIDADE') as TipoRequisitoAcesso); setSelecionandoCapacidade(false); }} placeholder="Tipo" disabled={salvando} /></div>
                            <div className={styles.campo_definicao}><SelecionadorOpcoes opcoes={OPCOES_MODO_REQUISITO.map(opcao => ({ value: opcao.value, label: opcao.label }))} valor={modoRequisito} onChange={valor => setModoRequisito((valor ?? 'OCULTAR') as ModoRequisitoAcesso)} placeholder="Modo" disabled={salvando} /></div>
                        </div>

                        {tipoRequisito === 'CAPACIDADE'
                            ? (selecionandoCapacidade
                                ? (
                                    <div className={styles.selecionador_capacidade}>
                                        <Componente_Selecionador__Capacidade
                                            aoConfirmar={async capacidade => { await adicionarRequisito(capacidade.id); }}
                                            aoCancelar={() => setSelecionandoCapacidade(false)}
                                        />
                                    </div>
                                )
                                : <div className={styles.adicionar}><button type="button" className={styles.botao_adicionar} onClick={() => setSelecionandoCapacidade(true)} disabled={salvando}>Escolher capacidade e adicionar</button></div>)
                            : <div className={styles.adicionar}><button type="button" className={styles.botao_adicionar} onClick={() => void adicionarRequisito()} disabled={salvando}>Adicionar requisito</button></div>}
                    </div>
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="perigo" onClick={() => void deletar()} disabled={salvando}>Deletar Catálogo</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

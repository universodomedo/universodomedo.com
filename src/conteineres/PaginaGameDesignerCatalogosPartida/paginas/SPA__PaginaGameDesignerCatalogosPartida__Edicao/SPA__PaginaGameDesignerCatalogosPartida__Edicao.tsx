import { useState } from 'react';

import styles from './styles.module.css';

import type { TipoPartida } from 'types-nora-api';
import { useContexto__PaginaGameDesignerCatalogosPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Edicao/contexto';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };

export default function SPA__PaginaGameDesignerCatalogosPartida__Edicao() {
    const { catalogo, partidasNoCatalogo, partidasDisponiveis, salvando, nome, setNome, podeSalvarNome, salvarNome, alternarAtivoCatalogo, deletar, adicionarPartidaAoCatalogo, removerPartidaDoCatalogo, alternarExibicaoPartida, reordenarPartidasDoCatalogo } = useContexto__PaginaGameDesignerCatalogosPartida__Edicao();
    const [arrastandoId, setArrastandoId] = useState<number | null>(null);
    const [idParaAdicionar, setIdParaAdicionar] = useState<string>('');

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
        <section className={styles.edicao}>
            <label className={styles.campo}>
                <span>Nome do Catálogo</span>
                <div className={styles.linha}>
                    <input type="text" value={nome} onChange={evento => setNome(evento.target.value)} maxLength={120} disabled={salvando} />
                    <button type="button" className={styles.botao_secundario} onClick={() => void salvarNome()} disabled={!podeSalvarNome || salvando}>Salvar nome</button>
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
                    <button type="button" className={styles.botao_principal} onClick={adicionar} disabled={salvando || idParaAdicionar === ''}>Adicionar Partida</button>
                </div>
            </div>

            <div className={styles.acoes}>
                <button type="button" className={styles.botao_perigo} onClick={() => void deletar()} disabled={salvando}>Deletar Catálogo</button>
            </div>
        </section>
    );
};

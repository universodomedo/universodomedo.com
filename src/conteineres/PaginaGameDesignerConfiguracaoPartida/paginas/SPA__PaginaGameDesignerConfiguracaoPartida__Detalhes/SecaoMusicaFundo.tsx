'use client';

import styles from './secaoMusicaFundo.module.css';

import { useEffect, useState } from 'react';

import { NoraApi } from 'Api/NoraApi';
import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';
import { EventosApiRest } from 'types-nora-api';

// Seção auto-contida da Música de Fundo da Partida: carrega a atual (GET), abre o seletor (Componente_Selecionador__MusicaDeFundo) e salva direto ao confirmar (não tem o que ajustar, ≠ Arte de Capa).
export function SecaoMusicaFundo({ idPartida }: { idPartida: number }) {
    const [idMusica, setIdMusica] = useState<number | null>(null);
    const [nomeMusica, setNomeMusica] = useState<string | null>(null);
    const [selecionando, setSelecionando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        let ativo = true;
        NoraApi.RestGET(EventosApiRest.GET.Partidas.musicaFundo, { id: idPartida }, { mensagemErro: 'Não foi possível carregar a Música de Fundo.' })
            .then(resposta => { if (ativo) setIdMusica(resposta.idMusicaConfigurada); })
            .catch(() => { });
        return () => { ativo = false; };
    }, [idPartida]);

    async function salva(novoId: number | null, novoNome: string | null): Promise<void> {
        setSalvando(true);
        try {
            await NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarMusicaFundo, { id: idPartida, idMusicaConfigurada: novoId }, { mensagemErro: 'Não foi possível salvar a Música de Fundo.' });
            setIdMusica(novoId);
            setNomeMusica(novoNome);
            setSelecionando(false);
        } finally { setSalvando(false); }
    };

    return (
        <fieldset className={styles.secao}>
            <legend>Música de Fundo</legend>

            {selecionando ? (
                <>
                    <Componente_Selecionador__MusicaDeFundo idInicial={idMusica} aoConfirmar={(id, nome) => salva(id, nome)} />
                    <div className={styles.acoes}>
                        <button type="button" className={styles.botao_secundario} onClick={() => setSelecionando(false)} disabled={salvando}>Cancelar</button>
                    </div>
                </>
            ) : (
                <>
                    <p className={styles.estado}>{idMusica === null ? 'Nenhuma música de fundo definida.' : (nomeMusica !== null ? `Música: ${nomeMusica}` : 'Música de Fundo definida.')}</p>
                    <div className={styles.acoes}>
                        <button type="button" className={styles.botao_secundario} onClick={() => setSelecionando(true)} disabled={salvando}>{idMusica === null ? 'Escolher Música de Fundo' : 'Trocar Música de Fundo'}</button>
                        {idMusica !== null && <button type="button" className={styles.botao_remover} onClick={() => void salva(null, null)} disabled={salvando}>Remover música</button>}
                    </div>
                </>
            )}
        </fieldset>
    );
};

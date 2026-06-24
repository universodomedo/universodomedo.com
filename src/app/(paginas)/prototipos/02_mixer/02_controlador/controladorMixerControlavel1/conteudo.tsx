'use client';

import { GraphqlLeituras, MIXER_CANAL_CONTROLAVEL_1 } from 'types-nora-api';

import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { useMixerCanal } from '../../_compartilhado/useMixerCanal';
import styles from './styles.module.css';

const SELECT_MUSICA = { id: true, nome: true, fonteMusica: { nome: true } } as const;

// Caso 5 (controlador): superficie de controle do canal 1. Comanda AO VIVO qual MusicaConfigurada toca para os
// ouvintes do canal via WS (admin_definirMusica). Nao reproduz audio aqui — so comanda.
export function Componente_ConteudoPrototipo() {
    const { selecao, definirMusica, erro } = useMixerCanal(MIXER_CANAL_CONTROLAVEL_1);
    const consulta = useNoraGraphQLConsulta(() => GraphqlLeituras.MusicaConfigurada.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_MUSICA }), { valorInicial: [], carregando: 'Carregando músicas', mensagemErro: 'Não foi possível carregar as músicas.', carregamento: NoraApiCarregamento.BARRA });
    const musicas = consulta.data;
    const idAtual = selecao?.idMusicaConfigurada ?? null;

    return (
        <section className={styles.painel}>
            <div className={styles.linhaAtual}>
                <span className={styles.rotulo}>Tocando agora neste canal</span>
                <span className={styles.atual}>{idAtual != null ? `Música #${idAtual}` : 'Silêncio'}</span>
            </div>

            <div className={styles.lista}>
                {musicas.map(musica => (
                    <button key={musica.id} className={`${styles.item} ${idAtual === musica.id ? styles.itemAtivo : ''}`} onClick={() => definirMusica(musica.id)}>
                        <strong>{musica.nome}</strong>
                        <span className={styles.fonte}>{musica.fonteMusica?.nome ?? '—'}</span>
                    </button>
                ))}
                {musicas.length === 0 && consulta.carregando == null ? <p className={styles.vazio}>Nenhuma música configurada ainda.</p> : null}
            </div>

            <button className={styles.silenciar} onClick={() => definirMusica(null)} disabled={idAtual == null}>Silenciar canal</button>

            {erro ? <p className={styles.erro}>{erro}</p> : null}
        </section>
    );
};

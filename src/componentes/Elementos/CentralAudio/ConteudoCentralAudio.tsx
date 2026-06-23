'use client';

import styles from './PainelCentralAudio.module.css';

import { useEffect } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual, selectNivelVolume, selectTituloPaginaAtual } from 'Redux/selectors/audioPaginaSelectors';
import { setNivelVolume, type NivelVolume } from 'Redux/slices/audioPaginaSlice';
import { salvarNivelVolume } from 'Uteis/PreferenciaVolume/preferenciaVolume';

const SELECT_MUSICA = { id: true, nome: true, fonteMusica: { id: true, nome: true } } as const;

const NIVEIS_VOLUME: { nivel: NivelVolume; label: string }[] = [
    { nivel: 'BAIXO', label: 'Baixo' },
    { nivel: 'MEDIO', label: 'Médio' },
    { nivel: 'ALTO', label: 'Alto' },
    { nivel: 'MAXIMO', label: 'Máximo' },
];

// Conteúdo da Central de Áudio — só monta quando o painel está aberto (nunca no SSR), por isso pode usar GraphQL/Redux com segurança.
export default function ConteudoCentralAudio({ onFechar, onAtividade }: { onFechar: () => void; onAtividade: () => void }) {
    const dispatch = useAppDispatch();
    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const tituloPagina = useAppSelector(selectTituloPaginaAtual);
    const nivelVolume = useAppSelector(selectNivelVolume);

    const consulta = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idMusica ?? 0 }, pk: idMusica ?? 0, select: SELECT_MUSICA, mensagemErro: 'Não foi possível carregar a música atual', executarAoMontar: false });
    const recarregar = consulta.recarregar;

    useEffect(() => {
        if (idMusica == null) return;
        recarregar();
    }, [idMusica, recarregar]);

    const musica = idMusica != null ? consulta.data : null;

    return (
        <div className={styles.painel} onMouseMove={onAtividade}>
            <div className={styles.info}>
                {musica ? (
                    <>
                        <span className={styles.rotulo}>Tocando · {tituloPagina}</span>
                        <span className={styles.faixa}>{musica.nome} — {musica.fonteMusica.nome}</span>
                    </>
                ) : (
                    <span className={styles.vazio}>Nenhuma música tocando</span>
                )}
            </div>

            <div className={styles.volume}>
                <span className={styles.volumeRotulo}>Volume</span>
                <div className={styles.niveis}>
                    {NIVEIS_VOLUME.map(item => (
                        <button key={item.nivel} className={`${styles.nivel} ${item.nivel === nivelVolume ? styles.nivelAtivo : ''}`} onClick={() => { dispatch(setNivelVolume(item.nivel)); salvarNivelVolume(item.nivel); }}>{item.label}</button>
                    ))}
                </div>
            </div>

            <button className={styles.fechar} onClick={onFechar} title="Fechar">✕</button>
        </div>
    );
};

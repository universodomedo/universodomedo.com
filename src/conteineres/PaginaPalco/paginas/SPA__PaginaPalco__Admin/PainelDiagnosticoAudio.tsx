'use client';

import { type PalcoAudioDiagnosticoItem, type EMIT__Palco_diagnosticoAudio } from 'types-nora-api';

import styles from './stylesDiagnostico.module.css';

function formatarBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

function formatarTs(ts: number | null): string {
    if (ts === null) return '—';
    const segs = Math.floor((Date.now() - ts) / 1000);
    if (segs < 2) return 'agora';
    return `há ${segs}s`;
};

function BadgePapel({ papel }: { papel: PalcoAudioDiagnosticoItem['papel'] }) {
    const cls = papel === 'falante' ? styles.badge_falante : papel === 'ouvinte' ? styles.badge_ouvinte : styles.badge_aguardando;
    const label = papel === 'falante' ? 'FALANTE' : papel === 'ouvinte' ? 'OUVINTE' : 'AGUARDANDO';
    return <span className={cls}>{label}</span>;
};

function BarraNivel({ nivel }: { nivel: number }) {
    return (
        <div className={styles.barra_nivel_fundo}>
            <div className={styles.barra_nivel_fill} style={{ width: `${Math.min(100, nivel)}%` }} />
        </div>
    );
};

function LinhaInfo({ label, valor }: { label: string; valor: string }) {
    return <div className={styles.linha_info}><span className={styles.linha_label}>{label}</span><span className={styles.linha_valor}>{valor}</span></div>;
};

function CardDiagnostico({ item }: { item: PalcoAudioDiagnosticoItem }) {
    const ehFalante = item.papel === 'falante';
    const ehOuvinte = item.papel === 'ouvinte';
    const ehAguardando = item.papel === 'aguardando';

    return (
        <div className={styles.card}>
            <div className={styles.card_cabecalho}>
                <span className={styles.card_nome}>{item.nome}</span>
                <BadgePapel papel={item.papel} />
            </div>
            {ehFalante && (
                <div className={styles.card_secao}>
                    <LinhaInfo label="Mic" valor={item.microfoneEstado ?? '—'} />
                    <div className={styles.linha_info}><span className={styles.linha_label}>Nível</span><BarraNivel nivel={item.nivelMicrofone} /></div>
                    <LinhaInfo label="Cliente" valor={`${item.chunksGerados} chunks · ${formatarBytes(item.bytesEnviados)}`} />
                    <LinhaInfo label="Backend receb." valor={`${item.chunksRecebidosBackend} chunks · ${formatarBytes(item.bytesRecebidosBackend)}`} />
                    <LinhaInfo label="Encaminhados" valor={`${item.chunksEncaminhadosBackend} → ${item.ouvintesPorUltimoEncaminhamento} ouvinte(s)`} />
                    <LinhaInfo label="Último (backend)" valor={formatarTs(item.ultimoChunkBackendTs)} />
                </div>
            )}
            {ehOuvinte && (
                <div className={styles.card_secao}>
                    <LinhaInfo label="AudioCtx" valor={item.audioCtxEstado ?? '—'} />
                    <LinhaInfo label="Chunks recv." valor={`${item.chunksRecebidosOuvinte} · ${formatarBytes(item.bytesRecebidosOuvinte)}`} />
                    <LinhaInfo label="Erros decode" valor={String(item.errosDecodeRecentes)} />
                    <LinhaInfo label="Último chunk" valor={formatarTs(item.ultimoChunkOuvinteTs)} />
                </div>
            )}
            {ehAguardando && <p className={styles.sem_audio}>sem áudio — aguardando no lobby</p>}
            {item.erroRecente && <p className={styles.erro_recente}>⚠ {item.erroRecente}</p>}
        </div>
    );
};

type PainelDiagnosticoAudioProps = { diagnostico: EMIT__Palco_diagnosticoAudio | null };

export default function PainelDiagnosticoAudio({ diagnostico }: PainelDiagnosticoAudioProps) {
    return (
        <section className={styles.painel}>
            <h2 className={styles.titulo}>Diagnóstico de Áudio</h2>
            {!diagnostico || diagnostico.participantes.length === 0
                ? <p className={styles.vazio}>Nenhum participante no palco ainda.</p>
                : <div className={styles.cards}>{diagnostico.participantes.map(item => <CardDiagnostico key={item.idUsuario} item={item} />)}</div>
            }
        </section>
    );
};
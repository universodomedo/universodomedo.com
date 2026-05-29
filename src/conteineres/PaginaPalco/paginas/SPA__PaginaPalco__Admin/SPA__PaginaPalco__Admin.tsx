'use client';

import { useRef, useState, type DragEvent } from 'react';
import cn from 'classnames';
import { type PalcoParticipanteDto, type PalcoParticipantePapel } from 'types-nora-api';

import styles from './styles.module.css';
import { useContexto__PaginaPalcoAdmin } from 'Contextos/Contexto__PaginaPalcoAdmin/contexto';
import CartaoParticipantePalco from 'Componentes/ElementosDePalco/CartaoParticipantePalco/CartaoParticipantePalco';

type SecaoAlvo = PalcoParticipantePapel | null;

const ROTULOS: Record<PalcoParticipantePapel, string> = {
    falante: 'Participando',
    ouvinte: 'Assistindo',
    aguardando: 'Em Espera',
};

const DESCRICOES: Record<PalcoParticipantePapel, string> = {
    falante: 'Falam e ouvem',
    ouvinte: 'Ouvem apenas',
    aguardando: 'Aguardando entrada',
};

const ORDEM_SECOES: PalcoParticipantePapel[] = ['falante', 'ouvinte', 'aguardando'];

export default function SPA__PaginaPalco__Admin() {
    const { estado, processando, erro, handleCriar, handleEncerrar, handleDefinirPapel } = useContexto__PaginaPalcoAdmin();
    const idArrastando = useRef<number | null>(null);
    const [secaoAlvo, setSecaoAlvo] = useState<SecaoAlvo>(null);
    const palcoAtivo = estado?.ativo ?? false;

    const participantesPorPapel = (papel: PalcoParticipantePapel): PalcoParticipanteDto[] => estado?.participantes.filter(p => p.papel === papel) ?? [];
    const handleDragStart = (idUsuario: number): void => { idArrastando.current = idUsuario; };
    const handleDragEnd = (): void => { idArrastando.current = null; setSecaoAlvo(null); };
    const handleDragOver = (e: DragEvent, papel: PalcoParticipantePapel): void => { e.preventDefault(); setSecaoAlvo(papel); };
    const handleDragLeave = (): void => { setSecaoAlvo(null); };
    const handleDrop = (e: DragEvent, papelDestino: PalcoParticipantePapel): void => {
        e.preventDefault();
        setSecaoAlvo(null);
        const id = idArrastando.current;
        if (id === null) return;
        idArrastando.current = null;
        handleDefinirPapel(id, papelDestino);
    };

    return (
        <main className={styles.pagina}>
            <h1 className={styles.titulo}>Administração do Palco</h1>
            {erro && <p className={styles.erro}>{erro}</p>}
            <div className={styles.acoes}>
                <button type="button" onClick={handleCriar} disabled={processando || palcoAtivo} className={styles.botao_abrir}>
                    {processando ? 'Aguarde...' : 'Abrir Palco'}
                </button>
                <button type="button" onClick={handleEncerrar} disabled={processando || !palcoAtivo} className={styles.botao_encerrar}>
                    {processando ? 'Aguarde...' : 'Encerrar Palco'}
                </button>
                <span className={cn(styles.indicador_status, palcoAtivo && styles.indicador_status_ativo)}>{palcoAtivo ? '● Palco Ativo' : '○ Palco Inativo'}</span>
            </div>
            {palcoAtivo && (
                <div className={styles.secoes}>
                    {ORDEM_SECOES.map(papel => {
                        const participantes = participantesPorPapel(papel);
                        return (
                            <section key={papel} onDragOver={e => { handleDragOver(e, papel); }} onDragLeave={handleDragLeave} onDrop={e => { handleDrop(e, papel); }} className={cn(styles.secao, secaoAlvo === papel && styles.secao_alvo)}>
                                <div className={styles.secao_cabecalho}>
                                    <h2 className={styles.secao_titulo}>{ROTULOS[papel]}</h2>
                                    <span className={styles.secao_contador}>({participantes.length})</span>
                                    <span className={styles.secao_descricao}>— {DESCRICOES[papel]}</span>
                                </div>
                                {participantes.length === 0
                                    ? <p className={styles.vazio}>Ninguém aqui</p>
                                    : <div className={styles.participantes}>{participantes.map(p => <CartaoParticipantePalco key={p.idUsuario} participante={p} processando={processando} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />)}</div>
                                }
                            </section>
                        );
                    })}
                </div>
            )}
            {!palcoAtivo && <p className={styles.palco_fechado}>O palco está fechado. Abra-o para gerenciar os participantes.</p>}
        </main>
    );
};
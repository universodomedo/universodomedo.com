'use client';

import { useRef, useState } from 'react';
import { type PalcoParticipanteDto, type PalcoParticipantePapel } from 'types-nora-api';

import { useContexto__PaginaPalcoAdmin } from 'Contextos/Contexto__PaginaPalcoAdmin/contexto';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

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

export default function SPA__PaginaPalcoAdmin() {
    const { estado, processando, erro, handleCriar, handleEncerrar, handleDefinirPapel } = useContexto__PaginaPalcoAdmin();

    const idArrastando = useRef<number | null>(null);
    const [secaoAlvo, setSecaoAlvo] = useState<SecaoAlvo>(null);

    const palcoAtivo = estado?.ativo ?? false;

    const participantesPorPapel = (papel: PalcoParticipantePapel): PalcoParticipanteDto[] =>
        estado?.participantes.filter(p => p.papel === papel) ?? [];

    const handleDragStart = (idUsuario: number): void => {
        idArrastando.current = idUsuario;
    };

    const handleDragEnd = (): void => {
        idArrastando.current = null;
        setSecaoAlvo(null);
    };

    const handleDragOver = (e: React.DragEvent, papel: PalcoParticipantePapel): void => {
        e.preventDefault();
        setSecaoAlvo(papel);
    };

    const handleDragLeave = (): void => {
        setSecaoAlvo(null);
    };

    const handleDrop = (e: React.DragEvent, papelDestino: PalcoParticipantePapel): void => {
        e.preventDefault();
        setSecaoAlvo(null);
        const id = idArrastando.current;
        if (id === null) return;
        idArrastando.current = null;
        handleDefinirPapel(id, papelDestino);
    };

    return (
        <main style={{ maxWidth: '64em', margin: '0 auto', padding: '2em', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginTop: 0 }}>Administração do Palco</h1>

            {erro && (
                <p style={{ color: '#c00', background: '#fee', padding: '0.75em', borderRadius: '0.4em', marginBottom: '1em' }}>{erro}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75em', marginBottom: '2em' }}>
                <button type="button" onClick={handleCriar} disabled={processando || palcoAtivo}>
                    {processando ? 'Aguarde...' : 'Abrir Palco'}
                </button>
                <button type="button" onClick={handleEncerrar} disabled={processando || !palcoAtivo}>
                    {processando ? 'Aguarde...' : 'Encerrar Palco'}
                </button>
                <span style={{ marginLeft: 'auto', alignSelf: 'center', color: palcoAtivo ? '#0a0' : '#888', fontWeight: 600 }}>
                    {palcoAtivo ? '● Palco ativo' : '○ Palco inativo'}
                </span>
            </div>

            {palcoAtivo && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1em' }}>
                    {ORDEM_SECOES.map(papel => {
                        const participantes = participantesPorPapel(papel);
                        const eSobreEstaSecao = secaoAlvo === papel;

                        return (
                            <section
                                key={papel}
                                onDragOver={e => { handleDragOver(e, papel); }}
                                onDragLeave={handleDragLeave}
                                onDrop={e => { handleDrop(e, papel); }}
                                style={{
                                    border: `0.15em ${eSobreEstaSecao ? 'dashed #448' : 'solid #ccc'}`,
                                    borderRadius: '0.6em',
                                    padding: '1em',
                                    background: eSobreEstaSecao ? '#f0f0ff' : '#fafafa',
                                    minHeight: '12em',
                                    transition: 'background 0.15s, border-color 0.15s',
                                }}
                            >
                                <h2 style={{ marginTop: 0, fontSize: '1em', fontWeight: 700, color: '#333' }}>
                                    {ROTULOS[papel]}
                                    <span style={{ marginLeft: '0.5em', fontWeight: 400, color: '#888', fontSize: '0.85em' }}>
                                        ({participantes.length})
                                    </span>
                                </h2>
                                <p style={{ margin: '0 0 0.75em', fontSize: '0.8em', color: '#999' }}>{DESCRICOES[papel]}</p>

                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                                    {participantes.map(p => (
                                        <CartaoParticipante
                                            key={p.idUsuario}
                                            participante={p}
                                            processando={processando}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                        />
                                    ))}
                                    {participantes.length === 0 && (
                                        <li style={{ color: '#bbb', fontSize: '0.85em', textAlign: 'center', paddingTop: '1em' }}>
                                            Ninguém aqui
                                        </li>
                                    )}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            )}

            {!palcoAtivo && (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '3em' }}>
                    O palco está fechado. Abra-o para gerenciar os participantes.
                </p>
            )}
        </main>
    );
};

type CartaoParticipanteProps = {
    participante: PalcoParticipanteDto;
    processando: boolean;
    onDragStart: (idUsuario: number) => void;
    onDragEnd: () => void;
};

function CartaoParticipante({ participante, processando, onDragStart, onDragEnd }: CartaoParticipanteProps) {
    return (
        <li
            draggable={!processando}
            onDragStart={() => { onDragStart(participante.idUsuario); }}
            onDragEnd={onDragEnd}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6em',
                padding: '0.5em 0.6em',
                background: '#fff',
                border: '0.1em solid #e0e0e0',
                borderRadius: '0.4em',
                cursor: processando ? 'not-allowed' : 'grab',
                userSelect: 'none',
            }}
        >
            <AvatarUsuarioEmVisualizacao_CACHED idUsuario={participante.idUsuario} avatarUsuarioMini />
            <span style={{ flex: 1, fontSize: '0.9em', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {participante.nome}
            </span>
        </li>
    );
};

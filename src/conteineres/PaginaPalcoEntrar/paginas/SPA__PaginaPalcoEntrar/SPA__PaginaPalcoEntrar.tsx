'use client';

import { useContexto__PaginaPalcoEntrar } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';

export default function SPA__PaginaPalcoEntrar() {
    const { entrando, conectado, meuPapel, estado, logs, entrarNoPalco, sairLocalmente } = useContexto__PaginaPalcoEntrar();

    const palcoAtivo = estado?.ativo ?? false;
    const aguardando = meuPapel === 'aguardando';

    return (
        <main style={{ maxWidth: '52em', margin: '0 auto', padding: '2em', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginTop: 0 }}>Palco</h1>

            {!palcoAtivo && !conectado && (
                <p style={{ color: '#777' }}>Nenhum palco ativo no momento. Aguarde o administrador abrir o palco.</p>
            )}

            <div style={{ display: 'flex', gap: '0.75em', marginBottom: '1.5em' }}>
                <button type="button" onClick={entrarNoPalco} disabled={entrando || conectado || !palcoAtivo}>
                    {entrando ? 'Entrando...' : 'Entrar no Palco'}
                </button>
                <button type="button" onClick={sairLocalmente} disabled={!conectado && !entrando}>
                    Sair
                </button>
            </div>

            <section style={{ border: '0.1em solid #444', borderRadius: '0.5em', padding: '1em', marginBottom: '1em' }}>
                <h2 style={{ marginTop: 0 }}>Status</h2>
                <p><strong>Conectado:</strong> {conectado ? 'sim' : 'não'}</p>
                {conectado && aguardando && (
                    <p style={{ color: '#885500', background: '#fff8ee', padding: '0.5em 0.75em', borderRadius: '0.35em', margin: '0.5em 0 0' }}>
                        ⏳ Aguardando aprovação do administrador para entrar no áudio.
                    </p>
                )}
                {conectado && !aguardando && (
                    <>
                        <p><strong>Seu papel:</strong> {meuPapel === 'falante' ? 'Participando (fala e ouve)' : 'Assistindo (apenas ouve)'}</p>
                        <p><strong>Microfone:</strong> {meuPapel === 'falante' ? 'ativo' : 'mutado'}</p>
                    </>
                )}
            </section>

            {conectado && !aguardando && estado && estado.participantes.filter(p => p.papel !== 'aguardando').length > 0 && (
                <section style={{ border: '0.1em solid #444', borderRadius: '0.5em', padding: '1em', marginBottom: '1em' }}>
                    <h2 style={{ marginTop: 0 }}>
                        Participantes ({estado.participantes.filter(p => p.papel !== 'aguardando').length})
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                        {estado.participantes.filter(p => p.papel !== 'aguardando').map(p => (
                            <li key={p.idUsuario} style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
                                <span style={{ flex: 1 }}>{p.nome}</span>
                                <span style={{ color: p.papel === 'falante' ? '#0a0' : '#888', fontSize: '0.85em' }}>
                                    {p.papel === 'falante' ? 'participando' : 'assistindo'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section style={{ border: '0.1em solid #444', borderRadius: '0.5em', padding: '1em' }}>
                <h2 style={{ marginTop: 0 }}>Logs</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3em', maxHeight: '18em', overflow: 'auto' }}>
                    {logs.map((log, index) => <code key={`${log}-${index}`}>{log}</code>)}
                    {logs.length === 0 && <p style={{ margin: 0, color: '#777' }}>Nenhum log ainda.</p>}
                </div>
            </section>
        </main>
    );
};

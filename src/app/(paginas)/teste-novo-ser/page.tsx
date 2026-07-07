'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventosApiRest, PAGINAS, type NovoSerNaSalaDeTeste, type NovoSerExecucaoNaSalaSolo } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';

export default function Page() {
    const router = useRouter();
    const [idOrigem, setIdOrigem] = useState('2');
    const [criados, setCriados] = useState<number[]>([]);
    const [clonando, setClonando] = useState(false);
    const [erroClone, setErroClone] = useState<string | null>(null);

    const [idNovoSer, setIdNovoSer] = useState('');
    const [naSala, setNaSala] = useState<NovoSerNaSalaDeTeste | null>(null);
    const [montando, setMontando] = useState(false);
    const [erroSala, setErroSala] = useState<string | null>(null);

    const [idPartida, setIdPartida] = useState('1');
    const [execucao, setExecucao] = useState<NovoSerExecucaoNaSalaSolo | null>(null);
    const [executando, setExecutando] = useState(false);
    const [erroExec, setErroExec] = useState<string | null>(null);

    const [rodando, setRodando] = useState(false);
    const [erroRodar, setErroRodar] = useState<string | null>(null);

    const [entrando, setEntrando] = useState(false);
    const [erroVivo, setErroVivo] = useState<string | null>(null);

    async function jogarAoVivo(): Promise<void> {
        const origem = Number(idOrigem);
        const partida = Number(idPartida);
        if (!Number.isInteger(origem) || origem <= 0) { setErroVivo('Informe um id de Ser legado válido.'); return; }
        if (!Number.isInteger(partida) || partida <= 0) { setErroVivo('Informe o id de uma Partida com manequim (1 = Desafio EA).'); return; }
        setEntrando(true);
        setErroVivo(null);
        try {
            const criado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.clonarDeLegado, { idSerLegadoOrigem: origem }, { mensagemErro: 'Não foi possível clonar o Ser.' });
            setCriados(anteriores => [...anteriores, criado.id]);
            setIdNovoSer(String(criado.id));
            await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.iniciarAoVivo, { idNovoSer: criado.id, idPartida: partida }, { mensagemErro: 'Não foi possível iniciar a Partida ao vivo.' });
            router.push(PAGINAS.jogo.emJogo.href);
        } catch {
            setErroVivo('Não foi possível jogar ao vivo (já há uma sala aberta? feche a partida atual; a Partida tem config?).');
            setEntrando(false);
        }
    };

    async function rodarTudo(): Promise<void> {
        const origem = Number(idOrigem);
        const partida = Number(idPartida);
        if (!Number.isInteger(origem) || origem <= 0) { setErroRodar('Informe um id de Ser legado válido.'); return; }
        if (!Number.isInteger(partida) || partida <= 0) { setErroRodar('Informe o id de uma Partida com manequim (1 = Desafio EA).'); return; }
        setRodando(true);
        setErroRodar(null);
        setExecucao(null);
        try {
            const criado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.clonarDeLegado, { idSerLegadoOrigem: origem }, { mensagemErro: 'Não foi possível clonar o Ser.' });
            setCriados(anteriores => [...anteriores, criado.id]);
            setIdNovoSer(String(criado.id));
            const resultado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.executarNaSalaSolo, { idNovoSer: criado.id, idPartida: partida }, { mensagemErro: 'Não foi possível executar na Sala Solo.' });
            setExecucao(resultado);
        } catch {
            setErroRodar('Não foi possível rodar (a Partida tem manequim? o Ser legado é jogável com ação de dano?).');
        } finally {
            setRodando(false);
        }
    };

    async function clonar(): Promise<void> {
        const idSerLegadoOrigem = Number(idOrigem);
        if (!Number.isInteger(idSerLegadoOrigem) || idSerLegadoOrigem <= 0) { setErroClone('Informe um id de Ser legado válido.'); return; }
        setClonando(true);
        setErroClone(null);
        try {
            const criado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.clonarDeLegado, { idSerLegadoOrigem }, { mensagemErro: 'Não foi possível clonar o Ser.' });
            setCriados(anteriores => [...anteriores, criado.id]);
            setIdNovoSer(String(criado.id));
        } catch {
            setErroClone('Não foi possível clonar o Ser (o id legado existe e é jogável com ficha?).');
        } finally {
            setClonando(false);
        }
    };

    async function montarNaSala(): Promise<void> {
        const id = Number(idNovoSer);
        if (!Number.isInteger(id) || id <= 0) { setErroSala('Informe um id de novo_ser válido (clone um acima).'); return; }
        setMontando(true);
        setErroSala(null);
        setNaSala(null);
        try {
            const resultado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.montarNaSalaDeTeste, { idNovoSer: id }, { mensagemErro: 'Não foi possível montar o Ser na Sala.' });
            setNaSala(resultado);
        } catch {
            setErroSala('Não foi possível montar o Ser na Sala.');
        } finally {
            setMontando(false);
        }
    };

    async function executar(): Promise<void> {
        const id = Number(idNovoSer);
        const partida = Number(idPartida);
        if (!Number.isInteger(id) || id <= 0) { setErroExec('Informe um id de novo_ser válido (clone acima).'); return; }
        if (!Number.isInteger(partida) || partida <= 0) { setErroExec('Informe o id de uma Partida configurada (empresta cenário + manequim).'); return; }
        setExecutando(true);
        setErroExec(null);
        setExecucao(null);
        try {
            const resultado = await NoraApi.RestPOST(EventosApiRest.POST.NovoSerRegistro.executarNaSalaSolo, { idNovoSer: id, idPartida: partida }, { mensagemErro: 'Não foi possível executar na Sala Solo.' });
            setExecucao(resultado);
        } catch {
            setErroExec('Não foi possível executar (a Partida está configurada e tem manequim? o Ser tem ação de dano?).');
        } finally {
            setExecutando(false);
        }
    };

    return (
        <main style={{ padding: '2.5em', color: '#D9D9D9', fontFamily: 'system-ui', maxWidth: '46em', margin: '0 auto' }}>
            <span style={{ fontSize: '0.7em', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B79051', fontWeight: 700 }}>Teste local · novo_ser</span>
            <h1 style={{ color: '#EBE0C9', margin: '0.3em 0 0.2em' }}>novo_ser → MF1 (esqueleto)</h1>

            <div style={{ marginTop: '1em', border: '1px solid #B79051', borderRadius: '0.6em', padding: '1em', background: '#15120A' }}>
                <div style={{ color: '#EBE0C9', fontSize: '0.92em', marginBottom: '0.7em' }}>Atalho de 1 clique: clona o Ser legado <strong>{idOrigem}</strong> e executa na Partida <strong>{idPartida}</strong> (id 1 = Desafio EA, tem o Manequim de Treino).</div>
                <div style={{ display: 'flex', gap: '0.6em', flexWrap: 'wrap' }}>
                    <button type="button" onClick={rodarTudo} disabled={rodando} style={{ ...botaoStyle(rodando), background: rodando ? '#1A1725' : '#B79051', color: '#0B0A10', fontWeight: 700 }}>{rodando ? 'Rodando...' : 'Rodar tudo (síncrono → MF1)'}</button>
                    <button type="button" onClick={jogarAoVivo} disabled={entrando} style={{ ...botaoStyle(entrando), background: entrando ? '#1A1725' : '#7CC576', color: '#0B0A10', fontWeight: 700 }}>{entrando ? 'Entrando...' : 'Jogar ao vivo (clona → tela Solo oficial) ▶'}</button>
                </div>
                {erroRodar && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroRodar}</p>}
                {erroVivo && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroVivo}</p>}
                {execucao && (
                    <div style={{ marginTop: '0.9em', color: '#EBE0C9', fontSize: '0.9em' }}>
                        <div><strong>{execucao.nomeSer}</strong> · {execucao.nomeAcao} → {execucao.nomeAlvo}</div>
                        <div>Durabilidade do manequim: {execucao.durabilidadeAntes} → {execucao.durabilidadeDepois} <span style={{ color: '#DB8A47' }}>(dano {execucao.danoAplicado})</span></div>
                        <div style={{ color: execucao.missaoVenceu ? '#7CC576' : '#DB8A47', fontWeight: 700, marginTop: '0.3em' }}>{execucao.missaoVenceu ? 'MF1 concluída: VITÓRIA ✓ — o Ser de novo_ser chegou e agiu na Partida' : 'Ação aplicada (MF não concluída)'}</div>
                    </div>
                )}
            </div>

            <section style={{ marginTop: '1.5em', borderTop: '1px solid #322F2F', paddingTop: '1.2em' }}>
                <h2 style={{ color: '#B79051', fontSize: '1em', letterSpacing: '0.06em' }}>1 · Popular (clonar Ser legado)</h2>
                <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Clona nome + membros + ficha reais de um Ser legado jogável para <code>novo_ser</code>. Cópia real, sem hardcode.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em' }}>
                    <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id do Ser legado:</label>
                    <input type="number" min={1} value={idOrigem} onChange={e => setIdOrigem(e.target.value)} style={inputStyle} />
                    <button type="button" onClick={clonar} disabled={clonando} style={botaoStyle(clonando)}>{clonando ? 'Clonando...' : 'Clonar → novo_ser'}</button>
                </div>
                {erroClone && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroClone}</p>}
                {criados.length > 0 && <p style={{ color: '#7CC576', marginTop: '0.6em', fontFamily: 'monospace' }}>Clonados: {criados.map(id => `novo_ser.seres#${id}`).join(', ')}</p>}
            </section>

            <section style={{ marginTop: '1.5em', borderTop: '1px solid #322F2F', paddingTop: '1.2em' }}>
                <h2 style={{ color: '#B79051', fontSize: '1em', letterSpacing: '0.06em' }}>2 · Montar na Sala (MF1)</h2>
                <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Carrega o Ser de <code>novo_ser</code> no runtime da Sala (caminho paralelo ao legado) e lista as <strong>ações disponíveis</strong>. Ter ≥ 1 ação = o Ser de novo_ser chega apto à MF1.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em' }}>
                    <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id do novo_ser:</label>
                    <input type="number" min={1} value={idNovoSer} onChange={e => setIdNovoSer(e.target.value)} placeholder="clone acima" style={inputStyle} />
                    <button type="button" onClick={montarNaSala} disabled={montando} style={botaoStyle(montando)}>{montando ? 'Montando...' : 'Montar na Sala'}</button>
                </div>
                {erroSala && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroSala}</p>}
                {naSala && (
                    <div style={{ marginTop: '1em', border: '1px solid #352E4C', borderRadius: '0.6em', padding: '1em', background: '#12101A' }}>
                        <div style={{ color: '#EBE0C9', fontWeight: 600 }}>{naSala.nome} <span style={{ color: '#6f6a7a', fontFamily: 'monospace', fontWeight: 400 }}>· id {naSala.id}</span></div>
                        <div style={{ color: naSala.acoes.length > 0 ? '#7CC576' : '#DB4747', fontSize: '0.85em', marginTop: '0.3em' }}>{naSala.acoes.length} ação(ões) disponível(is){naSala.acoes.length > 0 ? ' — chega apto à MF1 ✓' : ''}</div>
                        <ul style={{ marginTop: '0.5em' }}>{naSala.acoes.map(acao => <li key={acao.key} style={{ fontFamily: 'monospace', fontSize: '0.85em', color: '#c787ff' }}>{acao.nome}</li>)}</ul>
                    </div>
                )}
            </section>

            <section style={{ marginTop: '1.5em', borderTop: '1px solid #322F2F', paddingTop: '1.2em' }}>
                <h2 style={{ color: '#B79051', fontSize: '1em', letterSpacing: '0.06em' }}>3 · Executar na Sala Solo (dano no manequim)</h2>
                <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Monta a <strong>Sala Solo real</strong> (mesmo engine) com o Ser de novo_ser + cenário/manequim de uma Partida configurada, executa <strong>1 ação de dano</strong> no manequim e conclui a MF1. Vitória = o Ser chegou e <strong>agiu</strong> na Partida.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em', flexWrap: 'wrap' }}>
                    <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id do novo_ser:</label>
                    <input type="number" min={1} value={idNovoSer} onChange={e => setIdNovoSer(e.target.value)} placeholder="clone acima" style={inputStyle} />
                    <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id da Partida:</label>
                    <input type="number" min={1} value={idPartida} onChange={e => setIdPartida(e.target.value)} placeholder="Dia de Treinamento" style={inputStyle} />
                    <button type="button" onClick={executar} disabled={executando} style={botaoStyle(executando)}>{executando ? 'Executando...' : 'Executar ação'}</button>
                </div>
                {erroExec && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroExec}</p>}
                {execucao && (
                    <div style={{ marginTop: '1em', border: '1px solid #352E4C', borderRadius: '0.6em', padding: '1em', background: '#12101A' }}>
                        <div style={{ color: '#EBE0C9', fontWeight: 600 }}>{execucao.nomeSer} <span style={{ color: '#6f6a7a', fontWeight: 400 }}>· {execucao.nomeMissao}</span></div>
                        <div style={{ color: '#c787ff', fontFamily: 'monospace', fontSize: '0.85em', marginTop: '0.4em' }}>{execucao.nomeAcao} → {execucao.nomeAlvo}</div>
                        <div style={{ color: '#EBE0C9', fontSize: '0.85em', marginTop: '0.3em' }}>Durabilidade do manequim: {execucao.durabilidadeAntes} → {execucao.durabilidadeDepois} <span style={{ color: '#DB8A47' }}>(dano {execucao.danoAplicado})</span></div>
                        <div style={{ color: execucao.missaoVenceu ? '#7CC576' : '#DB8A47', fontSize: '0.9em', marginTop: '0.5em', fontWeight: 600 }}>{execucao.missaoVenceu ? 'MF1 concluída: VITÓRIA ✓ — o Ser de novo_ser chegou e agiu na Partida' : 'Ação aplicada (MF não concluída)'}</div>
                    </div>
                )}
            </section>
        </main>
    );
};

const inputStyle = { width: '6em', padding: '0.4em 0.6em', borderRadius: '0.4em', border: '1px solid #322F2F', background: '#07060B', color: '#EBE0C9' };

function botaoStyle(desabilitado: boolean) {
    return { padding: '0.55em 1em', borderRadius: '0.5em', border: '1px solid #B79051', background: desabilitado ? '#1A1725' : '#23202f', color: '#EBE0C9', cursor: desabilitado ? 'default' : 'pointer', fontSize: '0.9em' };
};